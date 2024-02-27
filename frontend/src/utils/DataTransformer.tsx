import Papa from "papaparse";

interface Person {
  firstName: string;
  lastName: string;
  invitedBy: string | null; // null for members
}

function transformAndGenerateCSV(data: any[]): string {
  // Transform data
  const transformedData = data.map((item: any) => {
    return {
      firstName: item["First Name"],
      lastName: item["Last Name"],
      invitedBy: item["Invited By"],
    };
  });

  return transformPersonsIntoCSV(transformedData);
}

function transformPersonsIntoCSV(data: Person[]): string {
  // Sort data by last name
  const sortedData = data.sort((a, b) => {
    if (!a.lastName) return 1; // Stick at the end if lastName is empty
    if (!b.lastName) return -1; // Stick at the end if lastName is empty
    const lastNameA = a.lastName.toLowerCase();
    const lastNameB = b.lastName.toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  // Filter out members (those with invitedBy as null or "n/a")
  const filteredData = sortedData.filter((person) => person.invitedBy !== null && person.invitedBy !== "n/a");

  const rowsPerPage = 43;
  const colsPerPage = 3;
  const numRepetitions = Math.ceil(
    filteredData.length / (rowsPerPage * colsPerPage)
  );
  const totalRows = rowsPerPage * numRepetitions;
  const transformedData = [];

  transformedData.push(["", "Last Name", "First Name", "", "Last Name", "First Name", "", "Last Name", "First Name"]);

  for (let i = 0; i < totalRows; i++) {
    const row = [""];
    for (let j = 0; j < colsPerPage; j++) {
      // Calculate the current page number and adjust the index calculation
      const currentPage = Math.floor(i / rowsPerPage);
      const index =
        j * rowsPerPage +
        (i % rowsPerPage) +
        currentPage * rowsPerPage * colsPerPage;
      if (index < filteredData.length) {
        const item = filteredData[index];
        row.push(item.lastName, item.firstName);
      } else {
        row.push("", "");
      }
      // Add empty space after each column except the last one
      if (j < colsPerPage - 1) {
        row.push("");
      }
    }
    transformedData.push(row);
  }

  // Convert to CSV
  const csv = Papa.unparse(transformedData);

  return csv;
}

export { transformAndGenerateCSV };
