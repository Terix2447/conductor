// переменные
const contextMenu = document.querySelector('.context-menu');//контекст-меню
const arrowBack = document.querySelector('.img');//кнопка назад
const file = document.querySelector('#file');//кнопка создать файл
const folder = document.querySelector('#folder');//кнопка создать папку
const panel = document.querySelector('.panel');//панель где располагаются все папки и файлы
const path = document.querySelector('.path');//путь до папки
const search = document.querySelector(".search");//меню поиска файлов,папок
const input = document.querySelector('.input');//input для поиска
const rename = document.querySelector('#rename');//кнопка переименовать
const remove = document.querySelector('#remove');// кнопка удалить
const searchMenu = document.querySelector('.menu-search'); //поиск по файлам
const root = document.querySelector('.root'); // кнопка домой
const replaceConfirm = document.querySelector('.replace_confirm');//кнопка заменить файл
const replaceCancel = document.querySelector('.replace_cancel');//кнопка отменить замену файла
const replace = document.querySelector('.replace');//окно замены файла
const translucentWindow = document.querySelector('.translucent_window');//прозрачный div, высвечивается вместе с окном замены файла
const inputFile = document.getElementById('input');//input для файлов с компьютера

let Id = 0;//переменная для разных id
let clickedId; // здесь лежит id  элемента ,на который мы нажали
let clickedObject; //здесь лежит объект элемента на который мы нажали
let clickedFolder; //переменная  в которой лежит папка на которую мы кликнули два раза
let searchEngineDirectory = [];// временный массив для поиска по имени 

// контекст-меню бразуера при нажатии на правую кнопку мыши не высвечивается
window.oncontextmenu = function () {
 return false;
}

//событие на загрузку файла с компьютера
inputFile.addEventListener('change',function(){
    const inputFile = document.getElementById('input').files[0];//находим объект файла,который  скинули с компа
    inputFile.rootDirectory = opendirectory;
    inputFile.id = Id++;
    inputFile.road = [];
    inputFile.rename= renaming;
    for (let item of opendirectory.road){
        inputFile.road.push(item);
    }
    opendirectory.directory.push(inputFile);
    newElement(inputFile,panel)
})

//функция поиска объекта
const searchFunc = function(event){
    clickedId = event.currentTarget.id; // находим id  элемента на который мы нажали
    //находим index данного элемента в директории
    const index = opendirectory.directory.findIndex((element)=> {
        return element.id == clickedId;
    }); 
    const element = opendirectory.directory[index]; // записываем в переменную  элемент на который мы нажали
    return element;
}

//функция переименовки одинаковых имен в директории
function nonrepeatName(object,array) {
    for (let i = 0; i < array.length; i++){
        let item = array[i];
        if(object.name == item){
            if (object.type == "folder"){
                object.name = "New Folder" + `(${opendirectory.indexName++})`;
            }
            else {
                object.name = "New File" + `(${opendirectory.indexName++})`;
            }
        }
        for(let j = 0; j < array.length; j++){ 
            let item = array[j];
            if(object.name == item){
                if (object.type == "folder"){
                    object.name = "New Folder" + `(${opendirectory.indexName++})`;
                }
                else {
                    object.name = "New File" + `(${opendirectory.indexName++})`;
                }
            }
        }
    }
}

//функция для поиска файлов/папок
function searchClick(){
    input.focus();//фокус на input
    searchEngineDirectory = [];// очищаем массив найденных по имени файлов/папок
    input.addEventListener('keydown',searchNames)
    document.removeEventListener('click',searchClick)
}
search.addEventListener('click',searchClick)

function elementSearchName(name,directory){
    if (directory.type == 'folder') {
        for (let obj of directory.directory){
            if (obj.name == name){
                searchEngineDirectory.push(obj);
            }
            elementSearchName(name,obj);
        }
    }
}

function elementSearchId(id,directory){
    if (directory.type == 'folder'){
        for (let obj of directory.directory){
            if (obj.id == id){
                return obj;
            }
            const NewObj = elementSearchId(id,obj)
            if(NewObj){
                return NewObj;
            }
        } 
        return null
    }
}

function searchNames (event){
    if(event.keyCode === 13){
        input.blur();
        const name = input.value;
        elementSearchName(name,opendirectory);
        console.log(searchEngineDirectory);
        searchMenu.classList.remove('none');
        if (searchEngineDirectory.length > 0) {
            for (let item of searchEngineDirectory) {
                newElement(item,searchMenu);
            }
        } else {
            searchMenu.innerText = "Ничего не найдено";
        }
        document.addEventListener('click',closeSearchMenu)
    }
} 

//функция нажатия на найденный эл.
const clickFunc  = function(event){
    let object =  elementSearchId(event.currentTarget.id,opendirectory);
    console.log(object);
    createRoad(object);
    if (object.type == "folder"){
        opendirectory =  object;
    } else {
        opendirectory = object.rootDirectory;
    }
    createDirectory(opendirectory.directory);
    input.value = ''
    searchMenu.classList.add('none');
}

//функция, которая строит путь до эл.
function createRoad(object){
    path.innerHTML = '';
    for (let item of object.road){
        let newElementRoad = document.createElement('div');
        newElementRoad.classList.add('path-item');
        path.append(newElementRoad); 
        newElementRoad.innerText= item.name + '>';
        newElementRoad.id= item.id;
        newElementRoad.addEventListener('click',function(){
            let obj =  searchObj(newElementRoad.id,opendirectory);
            createRoad(obj);
            opendirectory = obj;
            input.setAttribute('placeholder',"Поиск в " + `${opendirectory.name}`);
            createDirectory(opendirectory.directory);
        })
    }
}

//функция закрытия меню поиска
const closeSearchMenu = function (event){
    if (event.target.parentNode.className !== 'search-item') {
        searchMenu.innerHTML= '';
        input.value = ''
        searchMenu.classList.add('none');
        document.removeEventListener('click',closeSearchMenu)
    }
}

//функция создания объекта файла
const newObjFile = function (){
    opendirectory.indexName = 2;
    opendirectory.arrFile=[];
    const files = new File('davydov','file','New File',opendirectory);//создаем объект файл

    for (let item of opendirectory.road){
        files.road.push(item);
    }
    console.log(files);

    for (let i=0; i < opendirectory.directory.length;i++){
        let item = opendirectory.directory[i];
        let searchObj = item.name.includes("New File");
        if(searchObj) {
            opendirectory.arrFile.push(item.name); 
        }
    }
    if(opendirectory.arrFile.length > 0){
        nonrepeatName(files,opendirectory.arrFile);
    }
    opendirectory.directory.push(files); // заносим объект файл в масси в directory
    return files;
}

// функция создания объекта папки 
const newObjFolder = function (){
    opendirectory.indexName = 2;
    opendirectory.arrFolder=[];
    const folders = new Folder('denis','folder','New Folder', opendirectory);// создаем объект папку

    for (let item of opendirectory.road){
        folders.road.push(item);
    }
    folders.road.push(folders); 
    console.log(folders);
    for (let i=0; i < opendirectory.directory.length;i++){
        let item = opendirectory.directory[i];
        let searchObj = item.name.includes("New Folder");
        if(searchObj) {
            opendirectory.arrFolder.push(item.name); 
        }
    }
    if(opendirectory.arrFolder.length > 0){
        nonrepeatName(folders,opendirectory.arrFolder);
    }
    opendirectory.directory.push(folders); // заносим объект папку в массив directory
    return folders;
}

// функция создания div по объекту
const  newElement = function (object,gap){
    const newElement = document.createElement('div');//создаем DOM элемент
    newElement.setAttribute('style','border: 1px solid black; background-color: #fff;font-size:17px');//задаем ccs стили DOM элемента
    newElement.setAttribute('draggable', 'true');// атрибут для drag and drop'a
    let titleEl = document.createElement('h1');// создаем заголовок эл.
    newElement.append(titleEl); //добавляем заголовок файла в DOM эл.
    gap.append(newElement); // добавляем эл. на панель бразуера ,чтобы DOM эл. было видно
    titleEl.innerText= object.name;//задаем div'у имя объекта
    if (gap == searchMenu){//если окно поиска
        let span = document.createElement('span');//задаем span
        span.setAttribute('style','color:gray;font-size:12px');//стили для span'a
        span.innerText = '-' + object.rootDirectory.name;//задаем span'у его имя,то есть имя директории,в которой лежит файл/папка
        titleEl.append(span);
        newElement.classList.add('search-item'); 
        newElement.addEventListener('click',clickFunc);//ставим событие клика на элементы из поиска
    }
    newElement.id = object.id;//задаем div'у id объекта
    
    newElement.addEventListener('mouseover',function(){
        this.setAttribute('style','border: 1px solid black;background-color:#cccccc;font-size:17px');
    })
    newElement.addEventListener('mouseout',function(){
        this.setAttribute('style','border: 1px solid black;background-color: #fff;font-size:17px');
    })

    newElement.addEventListener('dragstart',HandlerDragstart);//событие когда мы только взяли элемент

    if (object.type == 'folder'){
        newElement.addEventListener('dragenter',HandlerDragenter);//событие когда div попадает в зону,в которую его можно переместить
        newElement.addEventListener('dragover',HandlerDragover);//событие, которое срабатывает каждый раз ,когда div находится над зоной,в которую он может быть сброшен
        newElement.addEventListener('drop',HandlerDrop);//срабатывает в тот момент, когда элемент будет брошен, если он может быть перемещён в текущую зону.
        newElement.addEventListener('dblclick',dblClickFunc);//событие на двойное нажатие на div(открыть папку)
    }
    newElement.addEventListener('contextmenu',openContextMenu);//событие на открытие контекст-меню
}


function HandlerDragstart(event){
    event.dataTransfer.setData("dragItem",this.id)
}   

function HandlerDragenter(event){
    console.log('dragenter',this);
    event.preventDefault();
}


function HandlerDragover(event) {
    event.preventDefault();
}
function HandlerDrop(event){
    const dragId = event.dataTransfer.getData("dragItem");
    const dragItem = document.getElementById(dragId);
    const dragObject = DragorDropElementSearch(dragId);
    console.log("dragObject",dragObject);
    console.log("DragItem",dragItem);
    console.log('drop',this);
    const dropObject = DragorDropElementSearch(this.id);
    console.log("dropObject",dropObject);
    let flag = true;
    console.log(flag)
    for (let item of dropObject.directory){
        if (item.name == dragObject.name) {
            flag = false;
            replace.classList.remove('none');
            translucentWindow.classList.add('--active');
            replaceConfirm.addEventListener('click',function(){
                const indexDragObject = searchObjectIndex(dragObject,opendirectory);
                opendirectory.directory.splice(indexDragObject,1);
                const index = searchObjectIndex(item,dropObject);
                dropObject.directory.splice(index,1);
                dropObject.directory.push(dragObject);
                dragObject.rootDirectory = dropObject;
                dragObject.road = [];
                if(dragObject.type == 'folder'){
                    for (let items of dropObject.road){
                        dragObject.road.push(items);
                    }
                    dragObject.road.push(dragObject)
                }else {
                    for (let items of dropObject.road){
                        dragObject.road.push(items);
                    }
                }
                replace.classList.add('none')
                dragItem.remove();
                translucentWindow.classList.remove('--active');
            })
            replaceCancel.addEventListener('click',function(){
                replace.classList.add('none');
                translucentWindow.classList.remove('--active');
            })
        }
    }
    if (flag == true) {
        const indexDragObject = searchObjectIndex(dragObject,opendirectory);
        opendirectory.directory.splice(indexDragObject,1);
        dragItem.remove();
        dropObject.directory.push(dragObject);
        dragObject.rootDirectory = dropObject;
        dragObject.road = [];
                if(dragObject.type == 'folder'){
                    for (let items of dropObject.road){
                        dragObject.road.push(items);
                    }
                    dragObject.road.push(dragObject)
                }else {
                    for (let items of dropObject.road){
                        dragObject.road.push(items);
                    }
                }
    }
}


function searchObjectIndex(objectRemove,directory){
    for (let i = 0; i < directory.directory.length;i++) {
        const item = directory.directory[i];
        if (item.name == objectRemove.name){
            return i;
        }
    }
}

function DragorDropElementSearch(id){
    for (let item of opendirectory.directory){
        if (item.id == id){
            return item;
        }
    }
}

//функция открытия контекст меню
const openContextMenu = function(event){
    contextMenu.classList.remove("none");
    const x = event.clientX
    const y = event.clientY
    contextMenu.setAttribute('style','position:absolute;top:'+y+'px;left:'+x+'px');
    clickedObject =  searchFunc(event); // записываем  в переменную объект ,который возвращает фукнция 
    console.log(clickedObject);
    remove.addEventListener('click',deleteElement);
    rename.addEventListener('click',renameElement);
    document.addEventListener('click',closeContextMenu);
} 

// функция закрытия контекст меню
const closeContextMenu = function (event) {
    if(event.target.className !== 'field' ){
        contextMenu.classList.add('none');
        document.removeEventListener('click',closeContextMenu)
    }
}

// функция удаления папки/файла
const deleteElement = function(){
    const index = opendirectory.directory.findIndex((element)=> {
        return element.id == clickedId;
    });
    if(index !=-1) {
        opendirectory.directory.splice(index, 1);
        const element = document.getElementById(clickedId);
        element.remove();
    }
    contextMenu.classList.add('none');
}

//функция(метод) переименования 
const renaming = function(){
    contextMenu.classList.add('none');
    const element = document.getElementById(this.id);
    const title = element.lastChild;
    title.innerText = '';
    title.setAttribute('style','display:none');
    const inputEl = document.createElement('input'); // создаем input эл. для функции переименовки
    inputEl.setAttribute('style','display:block'); //задаем css стили input эл.
    element.append(inputEl);
    inputEl.focus();
    inputEl.addEventListener('keydown',function(event){
        if(event.keyCode === 13){
            inputEl.blur();
            if (inputEl.value !== "") {
                clickedObject.name = inputEl.value;
            }
            title.innerText = clickedObject.name;
            inputEl.remove();
            title.setAttribute('style','display:block');
        }
    })
}

const renameElement = function(){
    clickedObject.rename();
}

//событие на создание файла
file.addEventListener('click',function(){
    const object = newObjFile();
    newElement(object,panel);
})
//событие на создание папки
folder.addEventListener('click',function(){
    const object = newObjFolder();
    newElement(object,panel);
})

//функция открытия папки
const dblClickFunc = function(event){
    arrowBack.setAttribute('style','display:block');
    clickedFolder =  searchFunc(event);
    console.log(clickedFolder);
    if (clickedFolder.type == "folder"){
        opendirectory =  clickedFolder;
    } else {
        opendirectory = clickedFolder.rootDirectory;
    }
    createRoad(opendirectory);
    createDirectory(opendirectory.directory);
}

//функция для поиска объекта по дереву
function searchObj (id,opendirectory) {
    for (let obj of opendirectory.directory){
        if (obj.id == id){
            return obj;
        }
    } 
   return searchObj(id, opendirectory.rootDirectory);
}

//функция создания директории
function createDirectory(directory){
    panel.innerHTML = "";
    for (let i = 0; i < directory.length; i++) {
        const arrayObj = directory[i];
        newElement(arrayObj,panel);
    }
    if (opendirectory.rootDirectory == null) {
        arrowBack.setAttribute('style', 'display:none')
    } else {
        arrowBack.setAttribute('style', 'display:block')
    }
    input.setAttribute('placeholder',"Поиск в " + `${opendirectory.name}`);
}

//функция создания предыдущей директории
const backDirectory = function (){
    const rootDirectory = opendirectory.rootDirectory;
    opendirectory = rootDirectory;
    createRoad(opendirectory);
    createDirectory(opendirectory.directory);
}
arrowBack.addEventListener('click',backDirectory)

//класс файла
class File {
    constructor(user,type,name, rootDirectory){
        this.data = new Date();
        this.user = user;
        this.type = type;
        this.name = name;
        this.id = Id++;
        this.indexName = 2;
        this.road = [];
        this.rename = renaming;
        this.rootDirectory = rootDirectory
    }
}

//класс папки
class Folder {
    constructor(user,type,name, rootDirectory){
        this.data = new Date();
        this.user = user;
        this.type = type;
        this.name = name; 
        this.id = Id++;
        this.indexName = 2;
        this.arrFolder = [];
        this.arrFile = [];
        this.road = [];
        this.directory= [];
        this.rename = renaming;
        this.rootDirectory = rootDirectory
    }
}

// в переменной object лежит начало дерева
const object = new Folder('denis','folder','root', null);

let opendirectory = object; // в opendirectory лежит открытая директория 
input.setAttribute('placeholder',"Поиск в " + `${opendirectory.name}`);
//событие ,когда мы кликаем домой
root.addEventListener('click',function(){
    opendirectory = object;
    createRoad(opendirectory);
    createDirectory(opendirectory.directory);
})