import './App.css';
import './bootstrap-4.0.0/dist/css/bootstrap.css';
import './fontawesome-free-5.15.4-web/css/all.css';
import { openDB } from 'idb';
import React, { useState,useEffect,useRef } from 'react';


const initDB = async () => {

  return await openDB('examDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('exams')) {
        db.createObjectStore('exams', { keyPath: 'id', autoIncrement: true });
      }
      db.clear()

    },
  });
};
const clearAllExams = async () => {
  const db = await initDB();
  const tx = db.transaction('exams', 'readwrite');
  const store = tx.objectStore('exams');
  
  await store.clear(); 
  
  await tx.done;
};



function dataURLtoBlob(dataURL) { 
const byteString = atob(dataURL.split(',')[1]); 
const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]; 
const ab = new ArrayBuffer(byteString.length); 
const ia = new Uint8Array(ab); 
for (let i = 0; i < byteString.length; i++) { 
  ia[i] = byteString.charCodeAt(i); } return new Blob([ab], { type: mimeString }); }


function createBlobURL(dataURL) {
   const blob = dataURLtoBlob(dataURL); 
   return URL.createObjectURL(blob); 
  }

async function readFileAsDataURL(file) { 

  const worker = new Worker(new URL('./fileWorker.js', import.meta.url)); 
  return new Promise((resolve, reject) => { 
    worker.onmessage = function(event) { 

      if (event.data.error) {

         reject(new Error(event.data.error)); }
       else if (event.data.result) {

         resolve(event.data.result); } else 
       { 

        reject(new Error("Unexpected response from worker")); } };
        worker.onerror = function(error) {

          reject(new Error(error.message)); };

         worker.postMessage(file); }); 
}

const getAllExams = async () => {
  const db = await initDB();
  const tx = db.transaction('exams', 'readonly');
  const store = tx.objectStore('exams');
  const examListEntry = await store.get(1);
  await tx.done;


  return examListEntry ? JSON.parse(examListEntry.data) : [];
};



function modernAlert(msg,alertType) {
  const alertContainer = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.style.background = alertType
  alert.innerHTML = msg;

  alertContainer.appendChild(alert);

  setTimeout(() => {
    alert.style.animation = 'fadeOut 0.5s ease-in';
    setTimeout(() => {
      alert.remove();
    }, 500); 
  }, 5500); 
}




function FilterBallon({sortType, onSelection, onScape}) {
  const balao = useRef(null);

  useEffect(() => {

    if (balao.current) {
     window.addEventListener('click', handleClickOutside); }
     let li = document.querySelectorAll("li"); li.forEach(el => {
     let checkboxli = el.querySelector("input"); if (checkboxli.id === sortType.current) { 
      checkboxli.checked = true; } else { checkboxli.checked = false; } }); return () => {
         window.removeEventListener('click', handleClickOutside); }; }, [balao, sortType, onScape]);
  
  const handleClickOutside = (event) => {
    if (!event.target.closest(".ballon") && !event.target.matches(".fa-filter")) {
      onScape()

    }
  };

  function unCheckAll() {
    let li = document.querySelectorAll("li");
    li.forEach(el => {
      let checkboxli = el.querySelector("input");
      checkboxli.checked = false;
 
    });
  }

  function sortByName() {
    unCheckAll();
    let nameFilter = document.querySelector("#nameFilter");
    nameFilter.checked = true;
    onSelection('nameFilter')

  }

  function sortByDate() {
    unCheckAll();
    let dateFilter = document.querySelector("#dateFilter");
    dateFilter.checked = true;
    onSelection('dateFilter')


  }

  function sortByDoctor() {
    unCheckAll();
    let doctorFilter = document.querySelector("#doctorFilter");
    doctorFilter.checked = true;
    onSelection('doctorFilter')


  }

  function sortByClinic() {
    unCheckAll();
    let clinicFilter = document.querySelector("#clinicFilter");
    clinicFilter.checked = true;
    onSelection('clinicFilter')


  }

  return (
    <div className='ballon' ref={balao}>
      <div className='content'>
        <ul>
          <li onClick={sortByName}> <input type='radio' id='nameFilter' className='' />Nome do exame</li>
          <li onClick={sortByDate}> <input type='radio' id='dateFilter' />Mais recentes</li>
          <li onClick={sortByDoctor}><input type='radio' id='doctorFilter' />Nome do doutor</li>
          <li onClick={sortByClinic}><input type='radio' id='clinicFilter' />Nome da clínica</li>
        </ul>
      </div>
    </div>
  );
}



function EditScreen({index, currentExamList, onSave, onCancel}) {
  const [isFirstRun, setIsFirstRun] = useState(true);
  const editDivRef = useRef(null);
  const primeiraLinhaRef = document.querySelector("#primeira-linha");
  const conteudoRef = document.querySelector("#conteudo")

  useEffect(() => {

    if (isFirstRun) {
      editDivRef.current.style.animation = "popupGrow 0.5s ease-out";
      primeiraLinhaRef.style.animation = "";
      conteudoRef.style.animation = "";
      primeiraLinhaRef.style.animationFillMode = "";
      conteudoRef.style.animationFillMode = "";
      setTimeout(() => {
        setIsFirstRun(false); 
      }, 500);
    }
  }, []); 
  
  function returnMain() {
    editDivRef.current.style.animation = "popupHide 0.5s ease-in";
    primeiraLinhaRef.style.animation = "bounceUp 2s ease-in-out";
    conteudoRef.style.animation = "bounceUpDelayed 2s ease-in-out";
    primeiraLinhaRef.style.animationFillMode = "forwards";
    conteudoRef.style.animationFillMode = "forwards";

    
    setTimeout(() => {

      onCancel();
    }, 500);
  }

  async function saveExam(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const examData = {
      nomeExame: formData.get('nomeExame'),
      dataExame: formData.get('dataExame'),
      nomeClinica: formData.get('nomeClinica'),
      nomeDoutor: formData.get('nomeDoutor'),
      arquivoExame: currentExamList[index].arquivoExame,
      observacoes: formData.get('observacoes')
    };
   
    let listExamData = currentExamList;

    function itemExists(arg) {
      return arg.some(obj => Object.keys(examData).every(chave =>
        obj[chave] === examData[chave]
      ));    
    }

    if (!itemExists(listExamData)) {
      listExamData.splice(index, 1, examData);
      const db = await initDB(); 
      const tx = db.transaction('exams', 'readwrite'); 
      const store = tx.objectStore('exams'); 
      await store.put({ id: 1, data: JSON.stringify(listExamData) });
      await tx.done;
      returnMain();
      modernAlert('Exame salvo com sucesso!','#a7ffa7')

      setTimeout(() => {
        onSave(listExamData);
      }, 500); 
    }else{
      modernAlert('Exame 100% igual já existe!','#ff8888')
    }
  }

  const exam = currentExamList[index];

  return (
    <div className='editarDiv' ref={editDivRef}>
      <form onSubmit={saveExam}>
        <h2>Editar Exame</h2>
        <span>Nome do exame:* <input type='text' defaultValue={exam.nomeExame} name='nomeExame' required maxLength="30" autoComplete="new-password" /></span>
        <span>Data do exame:* <input type='date' defaultValue={exam.dataExame} name='dataExame' required max={new Date().toISOString().split('T')[0]} /></span>
        <span>Nome da clínica:* <input type='text' defaultValue={exam.nomeClinica} name='nomeClinica' required maxLength="30" autoComplete="new-password" /></span>
        <span>Nome do doutor:* <input type='text' defaultValue={exam.nomeDoutor} name='nomeDoutor' required maxLength="30" autoComplete="new-password" /></span>
        <span>
        <a href="#" onClick={(e) => {
    e.preventDefault();
    const fileUrl = exam.arquivoExame;
    const blobUrl = createBlobURL(fileUrl);
    
    const worker = new Worker(new URL('./linkWorker.js', import.meta.url));
          worker.onmessage = function(event) {
              if (event.data.success) { 
                if (window.cordova && window.cordova.InAppBrowser) { 
                  window.cordova.InAppBrowser.open(blobUrl, '_blank', 'location=yes,zoom=yes,toolbar=yes,hardwareback=yes,enableViewportScale=yes'); } 
                  else { window.open(blobUrl, '_blank', 'noopener,noreferrer'); }
              } else {

 
              }
              worker.terminate();
          };

          worker.onerror = function(error) {

              worker.terminate();
          };

          worker.postMessage(fileUrl);
      }}>
    Ver arquivo
</a>

</span>



        <span>Observações: <input type='text' defaultValue={exam.observacoes} name='observacoes' maxLength="100" autoComplete="new-password" /></span>
        <button type='submit' >Salvar</button>
        <button type='button' onClick={returnMain}>Voltar</button>
      </form>
    </div>
  );
}

function AdicionarScreen({ onSave, onCancel }) {
  const [isFirstRun, setIsFirstRun] = useState(true);

  const adcDivRef = useRef(null);
  const primeiraLinhaRef = document.querySelector("#primeira-linha");
  const conteudoRef = document.querySelector("#conteudo")

  useEffect(() => {

    if (isFirstRun) {
      adcDivRef.current.style.animation = "popupGrow 0.5s ease-out";
      primeiraLinhaRef.style.animation = "";
      conteudoRef.style.animation = "";
      primeiraLinhaRef.style.animationFillMode = "";
      conteudoRef.style.animationFillMode = "";
      setTimeout(() => {
        setIsFirstRun(false);
      }, 500);
    }
  }, []); 

  function returnMain() {

    adcDivRef.current.style.animation = "popupHide 0.5s ease-in-out";
    primeiraLinhaRef.style.animation = "bounceUp 2s ease-in-out";
    conteudoRef.style.animation = "bounceUpDelayed 2s ease-in-out";
    primeiraLinhaRef.style.animationFillMode = "forwards";
    conteudoRef.style.animationFillMode = "forwards";

    setTimeout(() => {
      onCancel();
    }, 500);

  }

  async function saveExam(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const file = formData.get('arquivoExame');

    const arquivoExame = await readFileAsDataURL(file);
    const examData = {
      nomeExame: formData.get('nomeExame'),
      dataExame: formData.get('dataExame'),
      nomeClinica: formData.get('nomeClinica'),
      nomeDoutor: formData.get('nomeDoutor'),
      arquivoExame: arquivoExame,
      observacoes: formData.get('observacoes')
    };

  
    let listExamData = await getAllExams() || [];

    function itemExists(arg) {
      return arg.some(obj => Object.keys(examData).every(chave =>
        obj[chave] === examData[chave]
      ));    
    }

    if (!itemExists(listExamData)) {
      listExamData.push(examData);
      const db = await initDB(); 
      const tx = db.transaction('exams', 'readwrite'); 
      const store = tx.objectStore('exams'); 
      await store.put({ id: 1, data: JSON.stringify(listExamData) });
      await tx.done;

      modernAlert('Exame salvo com sucesso!','#a7ffa7')
      returnMain(); 

      setTimeout(() => {
        onSave(listExamData);
      }, 500); 
    }else{
      modernAlert('Exame 100% igual já existe!','#ff8888')
    }
  }


  

  return (
    <div className='adicionarDiv' ref={adcDivRef}>
      <form onSubmit={saveExam}>
        <h2>Adicionar Exame</h2>
        <span>Nome do exame:* <input type='text' name='nomeExame' required maxLength="30" autoComplete="new-password" /></span>
        <span>Data do exame:* <input type='date' name='dataExame' required max={new Date().toISOString().split('T')[0]}/></span>
        <span>Nome da clínica:* <input type='text' name='nomeClinica' required maxLength="30" autoComplete="new-password"/></span>
        <span>Nome do doutor:* <input type='text' name='nomeDoutor' required maxLength="30" autoComplete="new-password"/></span>
        <span>Foto ou arquivo do exame:* <input type='file' name='arquivoExame' required /></span>
        <span>Observações: <input type='text' name='observacoes' maxLength="100" autoComplete="new-password"/></span>
        <button type='submit' >Salvar</button>
        <button type='button' onClick={returnMain}>Voltar</button>
      </form>
    </div>
  );
}

export default function App() {
  const [display, setDisplay] = useState('homeScreen');
  const [examList, setExamList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const sortRef = useRef(null);
  const noExamFound = useRef(null)



  useEffect(() => {

    const fetchExams = async () => { 
    const savedExams = await getAllExams(); 

    setExamList(savedExams); }; 
    fetchExams();
  },[])

  const components = {
    adicionarScreen: () => <AdicionarScreen onSave={setExamList} onCancel={()=>setDisplay('homeScreen')} />,
    editScreen: () => <EditScreen index={currentIndex} currentExamList={examList} onSave={setExamList} onCancel={()=>setDisplay('homeScreen')} />,
    filterBallon: () => <FilterBallon  sortType={sortRef}  onSelection={handleSort} onScape={()=>setDisplay('homeScreen')}/>

  };

  const DisplayComponent = components[display];

  function addExam() {
    window.scrollTo(0,0)
    setDisplay('adicionarScreen');
  }
  function editExam(ind) {
    window.scrollTo(0,0)
    setCurrentIndex(ind);
    setDisplay('editScreen');

  }

  function handleSort(isSorted){
    sortRef.current = isSorted
    if (isSorted === 'nameFilter') {
      examList.sort((a, b) => {
        if (a.nomeExame < b.nomeExame) {
          return -1;
        }
        if (a.nomeExame > b.nomeExame) {
          return 1;
        }
        return 0;
      });
    }else if (isSorted === 'dateFilter') {
        
      examList.sort((a, b) => {
        const dateA = new Date(a.dataExame);
        const dateB = new Date(b.dataExame);
        return dateB - dateA;
      });
    
    }else if(isSorted === 'doctorFilter') {
      examList.sort((a, b) => {
        if (a.nomeDoutor < b.nomeDoutor) {
          return -1;
        }
        if (a.nomeDoutor > b.nomeDoutor) {
          return 1;
        }
        return 0;
      });
    }else if(isSorted === 'clinicFilter') {
      examList.sort((a, b) => {
        if (a.nomeClinica < b.nomeClinica) {
          return -1;
        }
        if (a.nomeClinica > b.nomeClinica) {
          return 1;
        }
        return 0;
      });
    }
  
  }

  async function deleteExam(ind){
    let examItem = document.getElementsByClassName("exam-item")
    examItem[ind].style.animation = "popupHide 0.5s ease-in"
    const updatedExamList = examList.filter((_, index) => index !== ind);
    const db = await initDB(); 
    const tx = db.transaction('exams', 'readwrite'); 
    const store = tx.objectStore('exams'); 
    await store.put({ id: 1, data: JSON.stringify(updatedExamList) });
    await tx.done;
    setTimeout(() => {
      setExamList(updatedExamList);
    }, 500); 
    modernAlert('Exame excluído com sucesso!','#a7ffa7')
   
    
  }
  function filterExam(){
    
    setDisplay('filterBallon')
  }
  async function findExam(event){
    const value = event.target.value.toLowerCase();
    let savedExams = await getAllExams() || [];


    const filteredExams = savedExams.filter(exam =>
      exam.nomeExame.toLowerCase() === value ||
      exam.dataExame === value ||
      exam.nomeClinica.toLowerCase() === value ||
      exam.nomeDoutor.toLowerCase() === value
    );

    setExamList(filteredExams)
    if(filteredExams.length === 0 && value === ''){
      setExamList(savedExams)
    }
 
  }

  return (
    <div id="webView" className="container-fluid">
      <header className="d-flex justify-content-between align-items-center bg-primary text-white p-3">
        <h1>Gerenciador de Exames</h1>
      </header>
      {DisplayComponent && <DisplayComponent />}
      <div id="primeira-linha" className="d-flex mt-4">
        <div className="input-group w-100">
          <div className="input-group-prepend">
            <span className="input-group-text bg-secondary text-white">
              <i className="fas fa-filter" onClick={()=>filterExam()}></i>
            </span>
          </div>
          <input className="form-control" type="text"  onChange={(event) => findExam(event)} placeholder="Pesquisar exames..." />
          <div className="input-group-append">
            <span className="input-group-text bg-secondary text-white">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>
      </div>

  <div id="conteudo" className="mt-4 bg-light p-4 rounded">
  {examList.length > 0 ? (
    <div className="exam-list">
      {examList.map((exam, index) => (
        <div key={index} id="conteudoSon" className="exam-item d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
          <div>
            <p><strong>Nome do exame:</strong> <span>{exam.nomeExame}</span></p>
            <p><strong>Data do exame:</strong> <span>{exam.dataExame}</span></p>
            <p><strong>Nome da clínica:</strong> <span>{exam.nomeClinica}</span></p>
            <p><strong>Nome do doutor:</strong> <span>{exam.nomeDoutor}</span></p>
            <p><strong>Foto ou arquivo do exame:</strong>
            <a href="#" onClick={(e) => {
    e.preventDefault();
    const fileUrl = exam.arquivoExame;
    const blobUrl = createBlobURL(fileUrl);
    
    const worker = new Worker(new URL('./linkWorker.js', import.meta.url));
          worker.onmessage = function(event) {
              if (event.data.success) { 
                if (window.cordova && window.cordova.InAppBrowser) { 
                  window.cordova.InAppBrowser.open(blobUrl, '_blank', 'location=yes,zoom=yes,toolbar=yes,hardwareback=yes,enableViewportScale=yes'); } 
                  else { window.open(blobUrl, '_blank', 'noopener,noreferrer'); }
              } else {

 
              }
              worker.terminate();
          };

          worker.onerror = function(error) {

              worker.terminate();
          };

          worker.postMessage(fileUrl);
      }}>
    Ver arquivo
</a>
</p>
            <p><strong>Observações:</strong> <span>{exam.observacoes}</span></p>

          </div>
          <div className="d-flex">
            <button className="btn btn-primary mx-2" onClick={()=>editExam(index)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-danger" onClick={()=>deleteExam(index)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p ref={noExamFound}>Nenhum exame encontrado.</p>
  )}
  </div>


      <button onClick={addExam} className="btn btn-success rounded-circle fixed-bottom m-4 p-3 shadow" id="addButton">
        <i className="fas fa-plus"></i>
      </button>
      <div id="alertContainer"></div>



    </div>
  );
}




