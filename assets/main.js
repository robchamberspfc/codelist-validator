let reader = new FileReader();
let validationValues = []
let inputData = []
let columnSelection = ""
let controlledListData = []

fetch('test-data/controlledLists.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        controlledListData = data
        let controlledLists = Object.keys(data)
        populateSelect(controlledLists, 'validationSelect')

    })

loadFile = () => {
    let file = document.querySelector('input[type=file]').files[0];
    reader.addEventListener('load', parseFile, false);
    if (file) {
        reader.readAsText(file);
    }
}

parseFile = () => {
    d3.csv.parse(reader.result, function (data, i) {
        inputData.push(data)
        if (i === 0) {
            headerRow = d3.keys(data)
            populateSelect(headerRow, 'headers')
        }
    });
}

populateSelect = (data, select) => {
    document.getElementById(select).hidden = false;
    let selectMenu = document.getElementById([select]);
    for (i = 0; i < data.length; i++) {
        selectMenu.options[selectMenu.options.length] = new Option(data[i], data[i]);
    }
};

columnSelected = () => {
    document.getElementById('validationTextInput').hidden = false;
    document.getElementById('validationControlledList').hidden = false;
    columnSelection = document.getElementById('headers').value

}

parseInput = () => {
    let validationInput = document.getElementById('validationInput').value
    validationValues = validationInput.split('\n');
    checkValues(validationValues)
}

controlledListSelected = () => {
    let validationSelected = document.getElementById('validationSelect').value
    validationValues = controlledListData[validationSelected]
    checkValues(validationValues)
}

checkValues = validationValues => {
    let dontMatch = []
    let k = 0
    for (i = 0; i < inputData.length; i++) {
        index = validationValues.findIndex(value => value === inputData[i][columnSelection]);
        if (index === -1) {
            k++
            console.log(i)
            dontMatch.push({
                Row: i+2,
                Value: inputData[i][columnSelection]
            })
        }

    }
    if (k == 0) {
        allClear()
    } else {
        populateTable(dontMatch)
    }
}

populateTable = data => {
    document.getElementById('table').innerHTML = ""
    document.getElementById('results').hidden = false;
    const tableRef = document.getElementById("table");
    const tr = tableRef.getElementsByTagName("tr");
    for (i = 0; i < data.length; i++) {
        let newRow = tableRef.insertRow(-1);
        let Cell = newRow.insertCell(0);
        let Text = document.createTextNode(data[i].Row);
        Cell.appendChild(Text);
        Cell = newRow.insertCell(1);
        Text = document.createTextNode(data[i].Value);
        Cell.appendChild(Text);
    }
    document.getElementById("results").scrollIntoView();
};

allClear = () => {
    document.getElementById('alert').hidden = false;
    document.getElementById("alert").scrollIntoView();
}