import { Button } from "@chakra-ui/react";

const DownloadLink = ({
  data,
  fileName = `ivy-list-${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}.csv`,
  text
}: {
  data: string;
  fileName?: string;
  text: string;
}) => {
  const handleDownload = async () => {
    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleDownload} colorScheme="blue">
      {text}
    </Button>
  );
};

export default DownloadLink;
