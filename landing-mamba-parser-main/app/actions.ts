"use server";

import { DIRECTUS_TOKEN, DIRECTUS_URL, DEEPFACE_API_URL } from "@/constants/env";
import { prisma } from "@/prisma/connect";
import { directus_files, Prisma } from "@prisma/client";
import { updateEmbedding } from "@prisma/client/sql";
import { randomBytes, randomUUID } from "crypto";

const TRIAL_DAYS = 3

export async function detectFaces(formData: FormData) {
  const file = formData.get("image-file") as File;
  if (file) {
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString("base64");
    const imageType = file.type.split(".")[file.type.split(".").length - 1];
    const res = await fetch(`${DEEPFACE_API_URL}/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img_path: `data:image/${imageType};base64,${base64String}`,
        enforce_detection: true,
      }),
    }).then((r) => r.json()) as DetectResult;
    return res;
  }
}

export async function createRequest(formData: FormData, selectedFaceIndex: number | null, detectResult: DetectResult | null) {
  console.log(`${DIRECTUS_URL}/files`)
  const uploadedFile = await fetch(`${DIRECTUS_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`
    },
    body: formData
  }).then(r => r.json() as Promise<{ data: directus_files }>)
  await prisma.directus_files.update({
    where: { id: uploadedFile.data.id }, data: {
      folder: "a2f9824e-6e97-4215-a5d9-1dcd03eb20fb"
    }
  })

  const trialDate = new Date()
  trialDate.setDate(trialDate.getDate() + TRIAL_DAYS)

  const request = await prisma.request.create({
    data: {
      directus_files: {
        connect: {
          id: uploadedFile.data.id
        }
      },
      directus_users: {
        create: {
          id: randomUUID(),
          role: 'fe6ef087-e4d5-478b-aba4-78150c239308',
          trial_till: trialDate,
          telegram_auth_token: {
            create: {
              id: randomBytes(20).toString('hex')
            }
          }
        }
      },
      selected_face_index: selectedFaceIndex,
      face_detect_result: JSON.stringify(detectResult)
    },
    select: {
      selected_face_index: true,
      directus_files: true,
      directus_users: {
        select: {
          telegram_auth_token: {
            select: {
              id: true
            }
          }
        }
      }
    }
  })

  await representRequest(request)

  return request.directus_users.telegram_auth_token[0].id
}

export async function representRequest(request: Prisma.requestGetPayload<{
  select: {
    selected_face_index: true,
    directus_files: true,
    directus_users: {
      select: {
        telegram_auth_token: {
          select: {
            id: true
          }
        }
      }
    }
  }
}>) {
  const res: { results: { embedding: number[] }[] } = await fetch(`${DEEPFACE_API_URL}/represent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      img_path: `${DIRECTUS_URL}/assets/${request.directus_files.id}`,
      enforce_detection: true,
    }),
  }).then((r) => r.json());
  return await prisma.$queryRawTyped(updateEmbedding(request.directus_files.id, JSON.stringify(res.results[request.selected_face_index ?? 0].embedding)))
}

export type DetectResult = {
  results: {
    h: number;
    left_eye: [number, number];
    right_eye: [number, number];
    w: number;
    x: number;
    y: number;
  }[];
};