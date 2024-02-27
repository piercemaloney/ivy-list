import React, { useRef } from "react";
import { Button, Input, VStack } from "@chakra-ui/react";
import { transformAndGenerateCSV } from "../utils/DataTransformer";
import Papa from "papaparse";
import { read, utils } from 'xlsx';

const FileUploader = ({
  onFileProcessed,
}: {
  onFileProcessed: (data: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (!fileList) return;
    const file = fileList[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const csv = utils.sheet_to_csv(worksheet);
        Papa.parse(csv, {
          complete: async (results: any) => {
            console.log("results", results);
            const data = await transformAndGenerateCSV(results.data);
            onFileProcessed(data);
          },
          header: true,
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <VStack>
      <Input
        type="file"
        onChange={handleFileChange}
        size="md"
        hidden // Hide the default input
        ref={fileInputRef}
      />
      <Button onClick={handleButtonClick} colorScheme="blue">Upload File</Button>
    </VStack>
  );
};

export default FileUploader;