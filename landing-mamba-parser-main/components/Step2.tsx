import { Box, Button, Dialog, Flex } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckIcon } from "@radix-ui/react-icons";
import { DetectResult } from "@/app/actions";

export function Step2({
  file,
  results,
  onSelected,
  back,
}: {
  file: File;
  results: DetectResult;
  onSelected: (index: number) => void;
  back: () => void;
}) {
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(
    null
  );
  const [faceUrls, setFaceUrls] = useState<string[]>([]);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const loadImage = async () => {
      const faceUrls = await Promise.all(
        results.results.map((result) => getFaceUrl(url, result))
      );
      setFaceUrls(faceUrls);
    };
    loadImage();
    return () => URL.revokeObjectURL(url);
  }, [file, results]);

  const onContinue = () => {
    onSelected(selectedFaceIndex!);
  };

  return (
    <Flex gap="4" direction="column">
      <Dialog.Title>
        На фото найдено несколько лиц <br />
        Выберите одно
      </Dialog.Title>

      <Flex gap="3" justify="center" wrap="wrap">
        {faceUrls.map((faceUrl, index) => (
          <Box key={index} className="relative">
            <button
              onClick={() => setSelectedFaceIndex(index)}
              className={`w-24 h-24 rounded-full overflow-hidden border-4 ${
                index === selectedFaceIndex
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <Image
                src={faceUrl}
                alt=""
                className="w-full h-full object-cover"
                width={96}
                height={96}
              />
            </button>

            {index === selectedFaceIndex && (
              <Flex
                className="absolute right-0 top-0 bg-blue-500 w-8 h-8 rounded-full"
                justify="center"
                align="center"
              >
                <CheckIcon className="w-6 h-6 text-white" />
              </Flex>
            )}
          </Box>
        ))}
      </Flex>

      <Flex gap="3" mt="4" justify="end">
        <Button type="button" variant="soft" color="gray" onClick={back}>
          Назад
        </Button>
        <Button disabled={selectedFaceIndex === null} onClick={onContinue}>
          Далее
        </Button>
      </Flex>
    </Flex>
  );
}

async function getFaceUrl(
  url: string,
  result: { x: number; y: number; w: number; h: number }
): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(url);

      canvas.width = result.w;
      canvas.height = result.h;
      ctx.drawImage(
        img,
        result.x,
        result.y,
        result.w,
        result.h,
        0,
        0,
        result.w,
        result.h
      );
      resolve(canvas.toDataURL());
    };
  });
}
