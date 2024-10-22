import { useState } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  extendTheme,
  Text,
} from "@chakra-ui/react"; // Import Text from Chakra UI
import FileUploader from "./components/FileUploader";
import DownloadLink from "./components/DownloadLink";

const theme = extendTheme({
  // You can customize your theme here
});

function App() {
  const [csvData, setCsvData] = useState<{ oldCSV: string, newCSV: string } | null>(null);
  return (
    <ChakraProvider theme={theme}>
      <Box
        className="App"
        p={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <VStack spacing={4}>
          <Text fontSize="4xl">Cole, my venmo is @Jaehee-Ashley</Text>
          {!csvData && (
            <>
              <Text>Upload the Excel list here.</Text>
              <FileUploader onFileProcessed={setCsvData} />
            </>
          )}
          {csvData && (
            <>
              <Text>Nice work bud. Now download it!</Text>
              <DownloadLink data={csvData.oldCSV} fileName={`ivy_list_${new Date().toLocaleDateString()}.csv`} text={"Download Traditional"}/>
              <DownloadLink data={csvData.newCSV} fileName={`NEW_ivy_list_${new Date().toLocaleDateString()}.csv`} text={"Download New"}/>
            </>
          )}
          <Text fontStyle="italic">-Pierce</Text>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
