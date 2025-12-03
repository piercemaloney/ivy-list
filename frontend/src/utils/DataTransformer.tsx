import Papa from "papaparse";

interface Person {
  memberName: string;
  guestOne: string;
  guestTwo: string | null; // null for some
  guestThree: string | null;
  guestFour: string | null;
  guestFive: string | null;
  guestSix: string | null;
  guestSeven: string | null;
  guestEight: string | null;
  guestNine: string | null;
  guestTen: string | null;
}

function transformAndGenerateCSV(data: any[]): { oldCSV: string; newCSV: string } {
  // Transform data
  const transformedData = data.map((item: any) => {
    return {
      memberName: item["Member Name (First and Last)"],
      guestOne: item["Guest 1 Name (First and Last)"],
      guestTwo: item["Guest 2 Name (First and Last)"],
      guestThree: item["Guest 3 Name (First and Last)"],
      guestFour: item["Guest 4 Name (First and Last)"],
      guestFive: item["Guest 5 Name (First and Last)"],
      guestSix: item["Guest 6 Name (First and Last)"],
      guestSeven: item["Guest 7 Name (First and Last)"],
      guestEight: item["Guest 8 Name (First and Last)"],
      guestNine: item["Guest 9 Name (First and Last)"],
      guestTen: item["Guest 10 Name (First and Last)"],
    };
  });

  const oldCSV = transformPersonsIntoCSV(transformedData);
  const newCSV = transformPersonsIntoNewCSV(transformedData)

  return {oldCSV, newCSV}
}

function transformPersonsIntoNewCSV(data: Person[]): string {
  // Group data by member name
  const memberDict: {[key: string]: string[]} = {};

  const aikoData = data.find(p => p.memberName && p.memberName.includes("Aiko"));
  if (aikoData) {
    console.log("Aiko's data:", aikoData);
    console.log("Guest 3:", aikoData.guestThree);
    console.log("Guest 4:", aikoData.guestFour);
    console.log("Guest 5:", aikoData.guestFive);
  }
  
  // Iterate through all persons in the data
  data.forEach((person) => {
    if (!person.memberName) return;
    
    // Normalize member name (handle first and last name)
    const memberNameSplit = person.memberName.split(' ');
    const memberName = memberNameSplit.length === 2 
      ? memberNameSplit[0] + " " + memberNameSplit[1] 
      : memberNameSplit[0];
    
    if (!memberDict[memberName]) {
      memberDict[memberName] = [];
    }
    const guestFields = [
      person.guestOne,
      person.guestTwo,
      person.guestThree,
      person.guestFour,
      person.guestFive,
      person.guestSix,
      person.guestSeven,
      person.guestEight,
      person.guestNine,
      person.guestTen
    ];
    
    guestFields.forEach((guest) => {
      if (guest) {
        const guestSplit = guest.split(' ');
        const guestName = guestSplit.length >= 2 
          ? guestSplit[0] + " " + guestSplit.slice(1).join(' ') 
          : guestSplit[0] || '';
        
        if (guestName) {
          memberDict[memberName].push(guestName);
        }
      }
    });
  });

  const maxGuests = 10

  const header = ["Last Name", "First Name"];
  for (let i = 1; i <= maxGuests; i++) {
    header.push(`GUEST #${i}`);
  }
  const transformedData: string[][] = [];
  transformedData.push(header);
  
  // Sort by member last name and create rows
  Object.entries(memberDict)
    .sort(([memberNameA], [memberNameB]) => {
      const lastNameA = memberNameA.split(" ").slice(-1)[0];
      const lastNameB = memberNameB.split(" ").slice(-1)[0];

      if (lastNameA === "" && lastNameB !== "") {
        return 1;
      } else if (lastNameA !== "" && lastNameB === "") {
        return -1;
      } else {
        return lastNameA.localeCompare(lastNameB);
      }
    })
    .forEach(([memberName, guests]) => {
      const split = memberName.split(' ');
      const row: string[] = [];
      if (split.length === 2) {
        row.push(split[1], split[0]); // Last Name, First Name
      } else {
        row.push("", split[0]);
      }
      for (let i = 0; i < maxGuests; i++) {
        row.push(guests[i] || "");
      }
      
      transformedData.push(row);
    });
  
  // Convert to CSV
  const csv = Papa.unparse(transformedData);
  return csv;
}

function transformPersonsIntoCSV(data: Person[]): string {
  const allGuests: { lastName: string; firstName: string }[] = [];

  data.forEach((person) => {
    const guestFields = [
      person.guestOne,
      person.guestTwo,
      person.guestThree,
      person.guestFour,
      person.guestFive,
      person.guestSix,
      person.guestSeven,
      person.guestEight,
      person.guestNine,
      person.guestTen
    ];

    guestFields.forEach((guest) => {
      if (guest && guest.trim()) {
        const nameParts = guest.trim().split(' ');
        if (nameParts.length >= 2) {
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');
          allGuests.push({ lastName, firstName });
        } else if (nameParts.length === 1) {
          allGuests.push({ lastName: "", firstName: nameParts[0] });
        }
      }
    });
  });

  const sortedData = allGuests.sort((a, b) => {
    if (!a.lastName) return 1; // Stick at the end if lastName is empty
    if (!b.lastName) return -1; // Stick at the end if lastName is empty
    const lastNameA = a.lastName.toLowerCase();
    const lastNameB = b.lastName.toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  const rowsPerPage = 43;
  const colsPerPage = 3;
  const numRepetitions = Math.ceil(
    sortedData.length / (rowsPerPage * colsPerPage)
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
      if (index < sortedData.length) {
        const item = sortedData[index];
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
