function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const submitBtn = document.getElementById("submitBtn");
  const formTitle = document.getElementById("formTitle");
  const tbody = document.getElementById("studentTableBody");
  const searchInput = document.getElementById("searchInput");
  const sortOption = document.getElementById("sortOption");

  function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
  }

  function renderTable(data = students) {
    tbody.innerHTML = "";
    data.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.course}</td>
        <td>${student.marks}</td>
        <td>
          <button onclick="editStudent(${index})">Edit</button>
          <button class="delete" onclick="deleteStudent(${index})">Delete</button>
        </td>`;
      tbody.appendChild(row);
    });
    updateSummary(data);
  }

  function updateSummary(data) {
    const summaryDiv = document.getElementById("courseSummary");
    const courseMap = {};

    data.forEach(stu => {
      if (!courseMap[stu.course]) courseMap[stu.course] = [];
      courseMap[stu.course].push(stu);
    });

    summaryDiv.innerHTML = "";
    for (let course in courseMap) {
      const box = document.createElement("div");
      box.className = "course-box fade-in";
      box.innerHTML = `
        <h4>${course}</h4>
        <p>${courseMap[course].length} student(s)</p>
        <button onclick="toggleDetails('${course}')">View Details</button>
        <div class="course-details hidden" id="details-${course}">
          ${courseMap[course].map(s => `
            <div class="course-student">
              <strong>${s.name}</strong> - Roll: ${s.roll}, Marks: ${s.marks}
            </div>`).join('')}
        </div>`;
      summaryDiv.appendChild(box);
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const roll = form.roll.value.trim();
    const course = form.course.value.trim();
    const marks = form.marks.value.trim();

    if (editIndex === null) {
      if (students.some(s => s.roll === roll && s.course === course)) {
        alert("Student with same Roll No in this course already exists.");
        return;
      }
      students.push({ name, roll, course, marks });
    } else {
      students[editIndex] = { name, roll, course, marks };
      submitBtn.textContent = "Add Student";
      formTitle.textContent = "Add Student";
      editIndex = null;
    }

    saveData();
    renderTable();
    form.reset();
  });

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(keyword) ||
      s.course.toLowerCase().includes(keyword)
    );
    renderTable(filtered);
  });

  sortOption.addEventListener("change", () => {
    let sorted = [...students];
    if (sortOption.value === "roll") {
      sorted.sort((a, b) => a.roll.localeCompare(b.roll));
    } else if (sortOption.value === "marks") {
      sorted.sort((a, b) => b.marks - a.marks);
    }
    renderTable(sorted);
  });

  renderTable();
});

function deleteStudent(index) {
  if (confirm("Delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    location.reload();
  }
}

function editStudent(index) {
  const s = students[index];
  document.getElementById("name").value = s.name;
  document.getElementById("roll").value = s.roll;
  document.getElementById("course").value = s.course;
  document.getElementById("marks").value = s.marks;
  document.getElementById("submitBtn").textContent = "Update Student";
  document.getElementById("formTitle").textContent = "Edit Student";
  editIndex = index;
}

function toggleDetails(course) {
  const box = document.getElementById(`details-${course}`);
  box.classList.toggle("hidden");
}
