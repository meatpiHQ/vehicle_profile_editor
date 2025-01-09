let vehicleProfile = {
    car_model: "",
    init: "",
    pids: []
};

function updateJsonDisplay() {
    document.getElementById('jsonOutput').textContent = 
        JSON.stringify(vehicleProfile, null, 2);
}

function addNewPid() {
    const pidSection = {
        pid: "",
        pid_init: "",
        parameters: []
    };
    vehicleProfile.pids.push(pidSection);
    renderPids();
}

function addParameter(pidIndex) {
    vehicleProfile.pids[pidIndex].parameters.push({
        name: "",
        class: "",
        expression: "",
        unit: ""
    });
    renderPids();
}

function removePid(index) {
    vehicleProfile.pids.splice(index, 1);
    renderPids();
}
  function removeParameter(pidIndex, paramIndex) {
      vehicleProfile.pids[pidIndex].parameters.splice(paramIndex, 1);
      renderPids();
  }

  function togglePidContent(element) {
      const content = element.nextElementSibling;
      content.classList.toggle('active');
  }

  function renderPids() {
      const pidsContainer = document.getElementById('pidsList');
      pidsContainer.innerHTML = '';

      vehicleProfile.pids.forEach((pid, pidIndex) => {
          const pidDiv = document.createElement('div');
          pidDiv.className = 'pid-item';
        
          const headerDiv = document.createElement('div');
          headerDiv.className = 'pid-header';
          headerDiv.onclick = function() { 
              togglePidContent(this);
              vehicleProfile.pids[pidIndex].isExpanded = !vehicleProfile.pids[pidIndex].isExpanded;
          };
          headerDiv.innerHTML = `
              <span>PID: ${pid.pid || 'New PID'}</span>
              <span class="material-icons">expand_more</span>
          `;

          const contentDiv = document.createElement('div');
          contentDiv.className = 'pid-content';

          if (pid.isExpanded) {
              contentDiv.classList.add('active');
          }

          contentDiv.innerHTML = `
              <div class="input-group">
                  <label>PID:</label>
                  <input type="text" value="${pid.pid}" 
                      onchange="vehicleProfile.pids[${pidIndex}].pid = this.value; updateJsonDisplay()">
              </div>
              <div class="input-group">
                  <label>PID Init:</label>
                  <input type="text" value="${pid.pid_init}"
                      onchange="vehicleProfile.pids[${pidIndex}].pid_init = this.value; updateJsonDisplay()">
              </div>
              <button class="btn danger" onclick="event.stopPropagation(); removePid(${pidIndex})">
                  <span class="material-icons">delete</span> Remove PID
              </button>
              <button class="btn primary" onclick="event.stopPropagation(); addParameter(${pidIndex})">
                  <span class="material-icons">add</span> Add Parameter
              </button>
              <div class="parameters-container">
                  ${renderParameters(pid.parameters, pidIndex)}
              </div>
          `;

          pidDiv.appendChild(headerDiv);
          pidDiv.appendChild(contentDiv);
          pidsContainer.appendChild(pidDiv);
      });
      updateJsonDisplay();
  }

  function renderParameters(parameters, pidIndex, isInitialLoad = false) {
      return parameters.map((param, paramIndex) => `
          <div class="parameter-item">
              <div class="parameter-header" onclick="toggleParameterContent(this)">
                  <span>${param.name || 'New Parameter'} (${param.class || 'no class'})</span>
                  <span class="material-icons">expand_more</span>
              </div>
              <div class="parameter-content ${isInitialLoad ? '' : 'active'}">
                  <div class="input-group">
                      <label>Name:</label>
                      <input type="text" value="${param.name}"
                          onchange="vehicleProfile.pids[${pidIndex}].parameters[${paramIndex}].name = this.value; updateJsonDisplay()">
                  </div>
                  <div class="input-group">
                      <label>Class:</label>
                      <input type="text" value="${param.class}"
                          onchange="vehicleProfile.pids[${pidIndex}].parameters[${paramIndex}].class = this.value; updateJsonDisplay()">
                  </div>
                  <div class="input-group">
                      <label>Expression:</label>
                      <input type="text" value="${param.expression}"
                          onchange="vehicleProfile.pids[${pidIndex}].parameters[${paramIndex}].expression = this.value; updateJsonDisplay()">
                  </div>
                  <div class="input-group">
                      <label>Unit:</label>
                      <input type="text" value="${param.unit}"
                          onchange="vehicleProfile.pids[${pidIndex}].parameters[${paramIndex}].unit = this.value; updateJsonDisplay()">
                  </div>
                  <div class="input-group">
                      <label>Min:</label>
                      <input type="text" value="${param.min || ''}"
                          onchange="vehicleProfile.pids[${pidIndex}].parameters[${paramIndex}].min = this.value; updateJsonDisplay()">
                  </div>
                  <div class="input-group">
                      <label>Max:</label>
                      <input type="text" value="${param.max || ''}"
                          onchange="vehicleProfile.pids[${pidIndex}].parameters[${paramIndex}].max = this.value; updateJsonDisplay()">
                  </div>
                  <button class="btn danger" onclick="removeParameter(${pidIndex}, ${paramIndex})">
                      <span class="material-icons">delete</span> Remove Parameter
                  </button>
              </div>
          </div>
      `).join('');
  }

function toggleParameterContent(element) {
    const content = element.nextElementSibling;
    content.classList.toggle('active');
    const icon = element.querySelector('.material-icons');

function addParameter(pidIndex) {
    vehicleProfile.pids[pidIndex].parameters.push({
        name: "",
        class: "",
        expression: "",
        unit: "",
        min: "",
        max: ""
    });
    renderPids();
}
    icon.textContent = icon.textContent === 'expand_more' ? 'expand_less' : 'expand_more';
}

let currentFileName = 'vehicle_profile.json';

function saveProfile() {
    const dataStr = JSON.stringify(vehicleProfile, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    a.click();
    URL.revokeObjectURL(url);
}

function loadProfile() {
    document.getElementById('fileInput').click();
}

function addNewPid() {
    const existingStates = vehicleProfile.pids.map((pid, index) => {
        const pidContent = document.querySelector(`.pid-content:nth-child(${index + 1})`);
        return pidContent ? pidContent.classList.contains('active') : false;
    });

    const pidSection = {
        pid: "",
        pid_init: "",
        parameters: [],
    };
    vehicleProfile.pids.push(pidSection);

    renderPids();

    const pidContents = document.querySelectorAll('.pid-content');
    pidContents.forEach((content, index) => {
        if (index < existingStates.length) {
            if (existingStates[index]) {
                content.classList.add('active');
            }
        } else {
            content.classList.add('active');
        }
    });
}
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    currentFileName = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        vehicleProfile = JSON.parse(e.target.result);
        document.getElementById('carModel').value = vehicleProfile.car_model;
        document.getElementById('init').value = vehicleProfile.init;
        renderPids();
        document.querySelectorAll('.pid-content, .parameter-content').forEach(content => {
            content.classList.remove('active');
        });
    };
    reader.readAsText(file);
});

function addParameter(pidIndex) {
    vehicleProfile.pids[pidIndex].parameters.push({
        name: "",
        class: "",
        expression: "",
        unit: "",
        min: "",
        max: ""
    });
    renderPids();

    const pidContents = document.querySelectorAll('.pid-content');
    pidContents[pidIndex].classList.add('active');
}

document.getElementById('carModel').addEventListener('change', function(e) {
    vehicleProfile.car_model = e.target.value;
    updateJsonDisplay();
});

document.getElementById('init').addEventListener('change', function(e) {
    vehicleProfile.init = e.target.value;
    updateJsonDisplay();
});

function copyJsonToClipboard() {
    const jsonContent = document.getElementById('jsonOutput').textContent;
    navigator.clipboard.writeText(jsonContent).then(() => {
        alert('JSON copied to clipboard!');
    });
}

renderPids();
