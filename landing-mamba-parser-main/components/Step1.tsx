import { Button, Dialog, Flex, Spinner } from "@radix-ui/themes";
import goodImg from "../public/good_photo.png";
import badImg from "../public/bad_photo.png";
import Image from "next/image";
import { DetectResult, detectFaces } from "@/app/actions";
import { useState } from "react";
import { CheckIcon } from "@radix-ui/react-icons";

export function Step1({
  onDetect,
}: {
  onDetect: (file: File, results: DetectResult) => void;
}) {
  const [file, setFile] = useState<null | File>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFileUpload = async (formData: FormData) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const file = formData.get("image-file") as File;
        const res = await detectFaces(formData);
        if (res?.results?.length) {
          await onDetect(file, res);
        }
        return res;
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <form action={onFileUpload}>
      <Flex direction="column" gap="4">
        <Dialog.Title>Загрузи фото своей половинки</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Фото без очков, не в пол оборота. По фото мы найдем совпадения на
          сайтах знакомств.
        </Dialog.Description>

        {!!file ? (
          <Image
            width={150}
            height={150}
            alt=""
            src={URL.createObjectURL(file)}
          />
        ) : (
          <Flex justify="center" gap="6">
            <Flex direction="column" align="center" gap="3">
              <Image
                src={goodImg}
                width={150}
                height={150}
                alt="good example"
                className="object-cover !rounded-full !overflow-hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-[50px] h-[50px] text-green-500"
                fill="currentColor"
              >
                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
              </svg>
            </Flex>
            <Flex direction="column" align="center" gap="3">
              <Image
                src={badImg}
                width={150}
                height={150}
                alt="good example"
                className="object-cover !rounded-full !overflow-hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-[50px] h-[50px] text-red-500"
                fill="currentColor"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
              </svg>
            </Flex>
          </Flex>
        )}
        <Flex direction="column" gap="3" align="center">
          <Button
            type="button"
            variant="outline"
            size="4"
            color={file ? "green" : undefined}
          >
            <label htmlFor="image-file">
              {file ? (
                <Flex align="center" gap="2">
                  <CheckIcon width={24} height={24} /> Выбрано
                </Flex>
              ) : (
                "Выбрать фото"
              )}
            </label>
          </Button>
          <input
            id="image-file"
            name="image-file"
            type="file"
            className="opacity-0 absolute -z-10"
            multiple={false}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </Flex>
      </Flex>

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button type="button" variant="soft" color="gray">
            Отмена
          </Button>
        </Dialog.Close>
        <Button disabled={!file || isLoading}>
          Далее {isLoading && <Spinner />}
        </Button>
      </Flex>
    </form>
  );
}
