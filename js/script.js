// Validate field
const form = document.getElementById("form");
const fName = document.getElementById("first-name");
const lName = document.getElementById("last-name");
const email = document.getElementById("email");
const jobTitle = document.getElementById("job-department");

//Submiting the form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs();
});

//Validate form for submition and sending the data to DB

function checkInputs() {
  // trim to remove the whitespaces
  const fNameValue = fName.value.trim();
  const lNameValue = lName.value.trim();
  const emailValue = email.value.trim();
  const jobDepartment = jobTitle.value.trim();
  const jobLocation = $("#job-location").val();
  let validate = [];

  // Validation Form

  if (fNameValue === "") {
    setErrorFor(fName, "Username cannot be blank");
  } else {
    setSuccessFor(fName, "Employee's first name was added!");
    validate.push("ok");
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email, "Employee's email was added!");
    validate.push("ok");
  }

  if (lNameValue === "") {
    setErrorFor(lName, "Last name cannot be blank");
  } else {
    setSuccessFor(lName, "Employee's last name was added!");
    validate.push("ok");
  }

  if (jobDepartment === "") {
    setErrorFor(jobTitle, "Department cannot be blank");
  } else {
    setSuccessFor(jobTitle, "Employee's department was added!");
    validate.push("ok");
  }
  if (jobLocation === "") {
    setErrorFor(jobTitle, "Location cannot be blank");
  } else {
    setSuccessFor(jobTitle, "Employee's location was added!");
    validate.push("ok");
  }

  // Validation successfull sending data to DB

  if (validate.length == 5) {
    $.ajax({
      url: "php/insertEmployee.php",
      type: "POST",
      cache: false,
      data: {
        firstName: $("#first-name").val(),
        lastName: $("#last-name").val(),
        email: $("#email").val(),
        departmentID: $("#job-department").val(),
      },
      complete: function () {
        form.reset();
        $(".title-add h3").text("Success").css("color", "#21ff7e");
      },
    });
    validate = [];
  }
}

// Validation form functuions

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  formControl.className = "form-control error";
  small.innerText = message;
}
function resetInput(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control";
}

function setSuccessFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  formControl.className = "form-control success";
  small.innerText = message;
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

//get Data from DB and Display the data

$.ajax({
  url: "php/getAll.php",
  type: "GET",
  dataType: "json",
  success: getData,
});

// getData Function

function getData(result) {
  const dbData = result;
  // Reset the locations for next request
  const resetContactList = document.querySelector("#contact-list");
  while (resetContactList.firstChild) {
    resetContactList.removeChild(resetContactList.firstChild);
  }

  dbData.data.forEach((value) => {
    $("#contact-list").append(`
  <div class="col-sm-6 pt-3 pb-3">
  <div class="panel">
    <div class="panel-body p-t-10 person">
      <div class="media-main">
        <a class="pull-left" href="#">
          <img
            class="thumb-lg img-circle bx-s"
            src="https://bootdey.com/img/Content/user_1.jpg"
            alt=""
          />
        </a>
        <div class="pull-right btn-group-sm">
          <a
            href="#"
            class="edit-btn btn btn-success tooltips"
            data-placement="top"
            data-toggle="modal"
            data-target="#addModal-edit"
            data-original-title="Edit"
            id = ${value.id}
            data-id=${value.id}

          >
            <i class="fa fa-pencil"></i>
          </a>
          <a
            href="#"
            class="btn btn-danger tooltips delete-btn"
            data-placement="top"
            data-original-title="Delete"
            data-toggle="modal" data-target="#confirm-delete"
            id = ${value.id}
            data-id=${value.id} 
          >
            <i class="fa fa-close"></i>
          </a>
        </div>
        <div class="info">
          <h4 class="info-name">${value.firstName} ${value.lastName}</h4>
          <p class="text-muted info-job-title">${value.department}</p>
          <p class="text-muted info-job-title">${value.email}</p>
          <p class="text-muted info-job-title">${value.location}</p>
          <input class ='idHidden' type='text' style="display:none" value="${value.id}">
          

        </div>
      </div>
      <div class="clearfix"></div>
      <hr/>
      <ul class="social-links list-inline m-0">
        <li class='pl-2'>
          <a
            title=""
            data-placement="top"
            data-toggle="tooltip"
            class="tooltips"
            href="#"
            data-original-title="LinkedIn"
            ><i class="fa fa-linkedin"></i
          ></a>
        </li>
        <li class='pl-2'>
          <a
            title=""
            data-placement="top"
            data-toggle="tooltip"
            class="tooltips"
            href="mailto: ${value.email}"
            data-original-title="Message"
            ><i class="fa fa-envelope-o"></i
          ></a>
        </li>
      </ul>
    </div>
  </div>
</div>
`);
  });

  //GEt departments

  $.ajax({
    url: "php/getAllDepartments.php",
    type: "GET",
    success: function (data) {
      data.data.forEach((department) => {
        $(".add-employee-btn").click(function (e) {
          //Reset the title
          $(".title-add h3")
            .text("Enter the new employee")
            .css("color", "black");

          resetInput(email);
          resetInput(lName);
          resetInput(fName);

          // Reset the locations for next request
          const resetDepartmentList = document.querySelector("#job-department");
          while (resetDepartmentList.length > 14) {
            resetDepartmentList.removeChild(resetDepartmentList.firstChild);
          }

          $("#job-department").append(`
            
            <option value=${department.id}>${department.name}</option>
            
            `);
        });
      });
    },
  });

  //Get locations

  $.ajax({
    url: "php/getLocations.php",
    type: "GET",
    success: function (locations) {
      locations.data.forEach((location) => {
        // Reset the locations for next request
        const resetDepartmentList = document.querySelector("#job-location");
        while (resetDepartmentList.length > 4) {
          resetDepartmentList.removeChild(resetDepartmentList.firstChild);
        }

        $("#job-location").append(`

          <option value=${location.id}>${location.name}</option>

        `);
      });
    },
  });
}

//Search by name or location
$(".search-btn").click(function () {
  const searchInput = $(".search").val();
  searchName(searchInput);
});

//Search function
function searchName(input) {
  $.ajax({
    url: "php/getEmployee.php",
    dataType: "json",
    type: "POST",
    data: {
      firstName: input,
      lastName: input,
      location: input,
      id: input,
    },
    success: function (data) {
      const searchData = data.data;
      const resetContactList = document.querySelector("#contact-list");
      while (resetContactList.firstChild) {
        resetContactList.removeChild(resetContactList.firstChild);
      }
      // If no result
      if (searchData == 0) {
        $("#contact-list").append(`
        <div class="col-sm-12 pt-3 pb-3">
        <div class="panel">
          <div class="panel-body p-t-10 person text-center">
            <h2>No Data found!</h2>
            <p>Search by full name, first name, last name or location</p>
          </div>
        </div>
      </div>
        `);
      }

      // Display the search data

      searchData.forEach((values) => {
        $("#contact-list").append(`
    <div class="col-sm-6 pt-3 pb-3">
    <div class="panel">
      <div class="panel-body p-t-10 person">
        <div class="media-main">
          <a class="pull-left" href="#">
            <img
              class="thumb-lg img-circle bx-s"
              src="https://bootdey.com/img/Content/user_1.jpg"
              alt=""
            />
          </a>
          <div class="pull-right btn-group-sm">
            <a
              href="#"
              class="edit-btn btn btn-success tooltips"
              data-placement="top"
              data-toggle="modal"
              data-target="#addModal-edit"
              data-original-title="Edit"
              id = ${values.id}
              data-id=${values.id}

            >
              <i class="fa fa-pencil"></i>
            </a>
            <a
              href="#"
              class="btn btn-danger tooltips delete-btn"
              data-placement="top"
              data-toggle="modal" data-target="#confirm-delete"
              data-original-title="Delete"
              id = ${values.id}

              data-id=${values.id}
              
            >
              <i class="fa fa-close"></i>
            </a>
          </div>
          <div class="info">
            <h4 class="info-name">${values.firstName} ${values.lastName}</h4>
            <p class="text-muted info-job-title">${values.department}</p>
            <p class="text-muted info-job-title">${values.email}</p>
            <p class="text-muted info-job-title">${values.location}</p>
            <input class ='id' type='text' style="display:none" value="${values.id}">
          </div>
        </div>
        <div class="clearfix"></div>
        <hr />
        <ul class="social-links list-inline p-b-10">
          
          
          <li>
            <a
              title=""
              data-placement="top"
              data-toggle="tooltip"
              class="tooltips"
              href="#"
              data-original-title="LinkedIn"
              ><i class="fa fa-linkedin"></i
            ></a>
          </li>
          
          <li>
            <a
              title=""
              data-placement="top"
              data-toggle="tooltip"
              class="tooltips"
              href="${values.email}"
              data-original-title="Message"
              ><i class="fa fa-envelope-o"></i
            ></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  `);
      });
    },
  });
}

//delete/edit By ID -- using .on because the buttons are not yet created

$("#contact-list").on("click", (e) => {
  if (e.target.className === "btn btn-danger tooltips delete-btn") {
    e.preventDefault();
    deleteRowById(e.target.dataset.id, e.target);
  } else if (e.target.className === "edit-btn btn btn-success tooltips") {
    e.preventDefault();
    editById(e.target.dataset.id);
  }
});

//Delete function
function deleteRowById(id, div) {
  $(".btn-ok").click(function (e) {
    $.ajax({
      url: "php/deleteByID.php",
      data: { id: id },
      success: function (data) {
        $(div).parent().parent().parent().parent().parent().addClass("fall");
        console.log($(div).parent().parent().parent().parent().parent());
        setInterval(function () {}, 1000);
      },
    });
  });
}

//Edit function

function editById(id) {
  resetInput(email);
  resetInput(lName);
  resetInput(fName);
  $(".title-edit h3").text("Update employee").css("color", "black");
  $.ajax({
    url: "php/getEmployeeByID.php",
    type: "POST",
    data: { id: id },
    success: function (data) {
      $.ajax({
        url: "php/getLocations.php",
        type: "GET",
        success: function (locations) {
          locations.data.forEach((location) => {
            // Reset the locations for next request

            const resetLocationList = document.querySelector(
              "#job-location-edit"
            );

            while (resetLocationList.childElementCount > 4) {
              resetLocationList.removeChild(resetLocationList.firstChild);
            }

            //Append the locations to the select options

            $("#job-location-edit").append(`

            <option value=${location.id}>${location.name}</option>

          `);
          });
        },
      });
      $.ajax({
        url: "php/getAllDepartments.php",
        type: "GET",
        success: function (departments) {
          departments.data.forEach((department) => {
            // Reset the departments for next request

            const resetDepartmentList = document.querySelector(
              "#job-department-edit"
            );
            while (resetDepartmentList.length > 14) {
              resetDepartmentList.removeChild(resetDepartmentList.firstChild);
            }

            //Append the Departments to the options

            $("#job-department-edit").append(`
              
              <option value=${department.id}>${department.name}</option>
              
              `);
          });
        },
      });

      // Get the data

      let fNameEdit = data.data[0].firstName;
      let lNameEdit = data.data[0].lastName;
      let emailEdit = data.data[0].email;
      let jobTitleEdit = data.data[0].departmentID;
      let location = data.data[0].locationID;

      $("#first-name-edit").val(fNameEdit);
      $("#last-name-edit").val(lNameEdit);
      $("#email-edit").val(emailEdit);
      $("#job-department-edit").val(jobTitleEdit);
      $("#job-location-edit").val(location);

      // Submit with the updated data

      $("#submit-edit").click(function (e) {
        console.log($("#job-location-edit").val());
        e.preventDefault();
        $.ajax({
          url: "php/updateEmployee.php",
          type: "POST",
          cache: false,
          data: {
            firstName: $("#first-name-edit").val(),
            lastName: $("#last-name-edit").val(),
            email: $("#email-edit").val(),
            departmentID: $("#job-department-edit").val(),
            name: $("#job-department-edit option:selected").text(),
            locationID: $("#job-location-edit").val(),
            id: id,
          },
          success: function (response) {
            form.reset();
            $(".title-edit h3").text("Success").css("color", "#21ff7e");
          },
        });
      });
    },
  });
}
