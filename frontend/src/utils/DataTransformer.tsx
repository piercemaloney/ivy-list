import Papa from "papaparse";

interface Person {
  firstName: string;
  lastName: string;
  invitedBy: string | null; // null for members
}

function transformAndGenerateCSV(data: any[]): { oldCSV: string; newCSV: string } {
  // Transform data
  const transformedData = data.map((item: any) => {
    return {
      firstName: item["First Name"],
      lastName: item["Last Name"],
      invitedBy: item["Invited By"],
    };
  });

  const oldCSV = transformPersonsIntoCSV(transformedData);
  const newCSV = transformPersonsIntoNewCSV(transformedData)

  return {oldCSV, newCSV}
}

function transformPersonsIntoNewCSV(data: Person[]): string {
  // sort by member last name!
  const memberDict: {[key: string]: string[]} = {};
  data
  .filter((person)=>person.invitedBy!=='n/a')
  .map((person)=>{
    const split = (person.invitedBy) ? person.invitedBy.split(' ') : ''
    const memberName = (split.length==2)? split[0] + " " + split[1]:split[0];
    const guestName = person.firstName + " " + person.lastName;
    // If the memberName exists, append the new guest to the array
    if (person.invitedBy) {
      if (memberDict[memberName]) {
        memberDict[memberName].push(guestName);
      } else {
        // Otherwise, create a new array for the first guest
        memberDict[memberName] = [guestName];
      }
    }

    console.log('memberdict', memberDict)
  })

  // const sortedData = data.sort((a, b)=>{
  //   const splitName = 
  // })
  const transformedData = [];
  transformedData.push(["Last Name", "First Name", "GUEST #1", "GUEST #2"]);
  Object.entries(memberDict)
  .sort(([memberNameA], [memberNameB]) => {
    // Split the member names to get the last names
    const lastNameA = memberNameA.split(" ").slice(-1)[0]; // Get the last name from memberNameA
    const lastNameB = memberNameB.split(" ").slice(-1)[0]; // Get the last name from memberNameB

    // Compare the last names for sorting
    // If last name A is empty, it should come after last name B
    if (lastNameA === "" && lastNameB !== "") {
      return 1; // lastNameA goes after lastNameB
    } else if (lastNameA !== "" && lastNameB === "") {
      return -1; // lastNameA goes before lastNameB
    } else {
      // Both have last names or both are empty; use localeCompare
      return lastNameA.localeCompare(lastNameB);
    }
  })
  .map(([memberName, guests]) => {
    const split = memberName.split(' ')
    let row = []
    if (split.length==2) {
      row.push(split[1], split[0])
    } else {
      row.push("", split[0])
    }
    guests.map((guest)=>{
      row.push(guest)
    })
    transformedData.push(row)
  });
  // Loop through the members list
// members.forEach((memberName) => {
//   const guests = memberDict[memberName] || []; // If no entry in memberDict, guests is empty

//   // Split the member name to extract first and last names
//   const split = memberName.split(' ');
//   let row = [];

//   if (split.length === 2) {
//     // Assuming full names are two words: Last Name, First Name
//     row.push(split[1], split[0]);
//   } else {
//     // For names with a single word, push empty Last Name
//     row.push("", split[0]);
//   }

//   // Add guests or empty strings if no guests
//   row.push(guests[0] || "", guests[1] || "");

//   // Add the row to transformedData
//   transformedData.push(row);
// });

// // Sort by Last Name as before
// transformedData.sort(([lastNameA], [lastNameB]) => {
//   // Compare the last names for sorting
//   if (lastNameA === "" && lastNameB !== "") {
//     return 1; // lastNameA goes after lastNameB
//   } else if (lastNameA !== "" && lastNameB === "") {
//     return -1; // lastNameA goes before lastNameB
//   } else {
//     return lastNameA.localeCompare(lastNameB);
//   }
// });
  // Convert to CSV
  const csv = Papa.unparse(transformedData);
  return csv;
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
