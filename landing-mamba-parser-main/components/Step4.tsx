import { Box, Button, Dialog, Flex, Text } from "@radix-ui/themes";
import startBotImg from "../public/start_bot.jpg";
import Image from "next/image";
import { NEXT_PUBLIC_BOT_NAME } from "@/constants/env";

export function Step4({ token }: { token: string }) {
  return (
    <Flex gap="4" direction="column">
      <Dialog.Title>Выберите способ получения отчета</Dialog.Title>

      <Dialog.Description>
        В течение 12 часов мы пришлем первый отчет с анкетами, которые похожи на
        твою половинку
      </Dialog.Description>

      <Flex justify="center" className="relative">
        <Image
          src={startBotImg}
          alt=""
          width={1284}
          height={698}
          className="rounded-2xl"
        />
        <Flex
          className="absolute text-white h-full"
          p="5"
          gap="3"
          direction="column"
          align="center"
        >
          <Text size="1">После перехода в бот нажми кнопку</Text>
          <Text size="2" weight="medium">
            &quot;Начать/Start&quot;
          </Text>
        </Flex>
      </Flex>

      <Flex
        gap="3"
        direction="column"
        justify="center"
        wrap="wrap"
        align="stretch"
      >
        <a
          href={`https://t.me/${NEXT_PUBLIC_BOT_NAME}?start=${token}`}
          target="_blank"
        >
          <Button size="4" className="!w-full">
            Перейти в бот
          </Button>
        </a>
      </Flex>
    </Flex>
  );
}
