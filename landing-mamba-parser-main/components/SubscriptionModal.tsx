import { Dialog } from "@radix-ui/themes";
import { useState } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { createRequest, DetectResult } from "@/app/actions";
import { Step4 } from "./Step4";

export function SubscriptionModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [detectResult, setDetectResult] = useState<DetectResult | null>(null);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(
    null
  );
  const [token, setToken] = useState("");

  async function onDetect(file: File, results: DetectResult) {
    setFile(file);
    setDetectResult(results);
    if (results.results.length > 1) setStep(2);
    else {
      setSelectedFaceIndex(0);
      await onCreateRequest(file);
    }
  }

  async function onSelectFromMultiple(index: number) {
    setSelectedFaceIndex(index);
    await onCreateRequest(file!, index);
  }

  async function onCreateRequest(file: File, index?: number) {
    const formData = new FormData();
    formData.append("file", file);
    const tokenRes = await createRequest(
      formData,
      index ?? null,
      detectResult
    );
    setToken(tokenRes);
    setStep(3);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content maxWidth="450px">
        {step === 1 && <Step1 onDetect={onDetect} />}
        {step === 2 && !!file && !!detectResult && (
          <Step2
            file={file}
            results={detectResult}
            onSelected={onSelectFromMultiple}
            back={() => setStep(1)}
          />
        )}
        {step === 3 && <Step3 onNext={() => setStep(4)} />}
        {step === 4 && <Step4 token={token} />}
      </Dialog.Content>
    </Dialog.Root>
  );
}
