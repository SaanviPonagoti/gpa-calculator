let semesters = [];
let semesterCount = 0;
let currentScale = 4;

function updateScale() {
  currentScale = parseInt(document.getElementById("scaleSelect").value);
}

function gradeDropdown() {
  if (currentScale === 4) {
    return `
      <select required>
        <option value="" disabled selected>Select grade</option>
        <option value="4">A</option>
        <option value="3.7">A-</option>
        <option value="3.3">B+</option>
        <option value="3">B</option>
        <option value="2.7">B-</option>
        <option value="2.3">C+</option>
        <option value="2">C</option>
        <option value="1.7">C-</option>
        <option value="1">D</option>
        <option value="0">F</option>
      </select>`;
  } else if (currentScale === 5) {
    return `
      <select required>
        <option value="" disabled selected>Select grade</option>
        <option value="5">A</option>
        <option value="4.5">A-</option>
        <option value="4">B+</option>
        <option value="3.5">B</option>
        <option value="3">C+</option>
        <option value="2.5">C</option>
        <option value="2">D</option>
        <option value="0">F</option>
      </select>`;
  } else {
    return `
      <select required>
        <option value="" disabled selected>Select grade</option>
        <option value="10">A</option>
        <option value="9">A-</option>
        <option value="8">B+</option>
        <option value="7">B</option>
        <option value="6">C+</option>
        <option value="5">C</option>
        <option value="4">D</option>
        <option value="0">F</option>
      </select>`;
  }
}

function addSemester() {
  if (semesterCount > 0) {
    const lastTable = document.getElementById("subjectsTable" + (semesterCount - 1));
    if (lastTable.rows.length <= 1) {
      alert("Please add at least one subject to Semester " + semesterCount + " before creating a new semester.");
      return;
    }
  }

  const container = document.getElementById("semesters");
  const block = document.createElement("div");
  block.className = "semester-block";
  block.innerHTML = `
    <h2>Semester ${semesterCount + 1}</h2>
    <table id="subjectsTable${semesterCount}">
      <tr>
        <th>Subject</th>
        <th>Credits</th>
        <th>Grade</th>
        <th>Action</th>
      </tr>
    </table>
    <button onclick="addSubject(${semesterCount})">Add Subject</button>
    <button onclick="calculateGPA(${semesterCount})">Calculate GPA</button>
    <p id="semesterGPA${semesterCount}">Semester GPA: -</p>
  `;
  container.appendChild(block);

  semesterCount++;
}

function addSubject(semIndex) {
  const table = document.getElementById("subjectsTable" + semIndex);
  const row = table.insertRow(-1);

  row.insertCell(0).innerHTML = `<input type="text" placeholder="Subject">`;
  row.insertCell(1).innerHTML = `<input type="number" placeholder="Credits" min="1" required>`;
  row.insertCell(2).innerHTML = gradeDropdown();
  row.insertCell(3).innerHTML = `<button onclick="removeRow(this)">Remove</button>`;
}

function removeRow(btn) {
  const row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function calculateGPA(semIndex) {
  const table = document.getElementById("subjectsTable" + semIndex);
  let totalPoints = 0, totalCredits = 0;

  for (let i = 1; i < table.rows.length; i++) {
    const credits = parseFloat(table.rows[i].cells[1].children[0].value);
    const gradePoint = parseFloat(table.rows[i].cells[2].children[0].value);

    if (!isNaN(credits) && !isNaN(gradePoint)) {
      totalCredits += credits;
      totalPoints += gradePoint * credits;
    }
  }

  if (totalCredits > 0) {
    const gpa = (totalPoints / totalCredits).toFixed(2);
    document.getElementById("semesterGPA" + semIndex).innerText = `Semester GPA: ${gpa} / ${currentScale}`;
    semesters[semIndex] = {points: totalPoints, credits: totalCredits};
    updateCGPA();
  } else {
    document.getElementById("semesterGPA" + semIndex).innerText = "Semester GPA: Please enter valid credits and grades.";
  }
}

function updateCGPA() {
  let totalPoints = 0, totalCredits = 0;
  semesters.forEach(s => {
    if (s) {
      totalPoints += s.points;
      totalCredits += s.credits;
    }
  });
  if (totalCredits > 0) {
    const cgpa = (totalPoints / totalCredits).toFixed(2);
    document.getElementById("cgpa").innerText = `Cumulative CGPA: ${cgpa} / ${currentScale}`;
  }
}

function simulateFuture() {
  const futureGPA = parseFloat(document.getElementById("futureGPA").value);
  const futureCredits = parseFloat(document.getElementById("futureCredits").value);

  if (!isNaN(futureGPA) && !isNaN(futureCredits)) {
    let totalPoints = 0, totalCredits = 0;
    semesters.forEach(s => {
      if (s) {
        totalPoints += s.points;
        totalCredits += s.credits;
      }
    });

    totalPoints += futureGPA * futureCredits;
    totalCredits += futureCredits;

    const projected = (totalPoints / totalCredits).toFixed(2);
    document.getElementById("simulationResult").innerText = `Projected CGPA: ${projected} / ${currentScale}`;
  }
}
