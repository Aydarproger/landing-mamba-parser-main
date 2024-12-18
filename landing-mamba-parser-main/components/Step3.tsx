import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Box, Button, Dialog, Flex, Text } from "@radix-ui/themes";

export function Step3({ onNext }: { onNext: () => void }) {
  return (
    <Flex gap="4" direction="column">
      <Dialog.Title>Фото успешно загружено</Dialog.Title>

      <Flex justify="center">
        <CheckCircledIcon width={40} height={40} color="green" />
      </Flex>

      <Flex
        gap="3"
        direction="column"
        justify="center"
        wrap="wrap"
        align="stretch"
      >
        <Button size="4" className="!w-full" onClick={onNext}>
          Далее
        </Button>
      </Flex>
    </Flex>
  );
}
