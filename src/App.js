import './App.css';
import './bootstrap-4.0.0/dist/css/bootstrap.css';
import './fontawesome-free-5.15.4-web/css/all.css';
import React, { useState,useEffect,useRef } from 'react';


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

  function saveExam(event) {
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
      localStorage.setItem('exam', JSON.stringify(listExamData));
      returnMain();
      modernAlert('Exame salvo com sucesso!','#a7ffa7')

      setTimeout(() => {
        onSave(listExamData);
      }, 500); 
    }else{
      modernAlert('Exame totalmente igual já existe!','#ff8888')
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

        if (window.cordova && window.cordova.InAppBrowser) {
            window.cordova.InAppBrowser.open(fileUrl, '_blank', 'location=yes');
        } else {
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
    }}>Ver Arquivo</a>
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
    const examData = {
      nomeExame: formData.get('nomeExame'),
      dataExame: formData.get('dataExame'),
      nomeClinica: formData.get('nomeClinica'),
      nomeDoutor: formData.get('nomeDoutor'),
      arquivoExame: await readFileAsDataURL(file),
      observacoes: formData.get('observacoes')
    };
  
    let listExamData = JSON.parse(localStorage.getItem('exam')) || [];

    function itemExists(arg) {
      return arg.some(obj => Object.keys(examData).every(chave =>
        obj[chave] === examData[chave]
      ));    
    }

    if (!itemExists(listExamData)) {
      listExamData.push(examData);
      localStorage.setItem('exam', JSON.stringify(listExamData));

      modernAlert('Exame salvo com sucesso!','#a7ffa7')
      returnMain(); 

      setTimeout(() => {
        onSave(listExamData);
      }, 500); 
    }else{
      modernAlert('Exame totalmente igual já existe!','#ff8888')
    }
  }

  async function readFileAsDataURL(file) {
    try {

        if (file.type === 'application/pdf') {
            return file.name; 
        }

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.onabort = error => reject(error);
            reader.readAsDataURL(file);
        });
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
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
        <span>Arquivo do exame:* <input type='file' name='arquivoExame' required /></span>
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

    const savedExams = JSON.parse(localStorage.getItem('exam')) || [];
    setExamList(savedExams);
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
        return dateA - dateB;
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

  function deleteExam(ind){
    let examItem = document.getElementsByClassName("exam-item")
    examItem[ind].style.animation = "popupHide 0.5s ease-in"
    const updatedExamList = examList.filter((_, index) => index !== ind);
    localStorage.setItem('exam', JSON.stringify(updatedExamList));
    setTimeout(() => {
      setExamList(updatedExamList);
    }, 500); 
    modernAlert('Exame excluído com sucesso!','#a7ffa7')
   
    
  }
  function filterExam(){
    
    setDisplay('filterBallon')
  }
  function findExam(event){
    const value = event.target.value.toLowerCase();
    let savedExams = JSON.parse(localStorage.getItem('exam') || []);


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
            <p><strong>Arquivo do exame:</strong>
            <a href="#" onClick={(e) => {
        e.preventDefault();
        const fileUrl = exam.arquivoExame;


        if (window.cordova && window.cordova.InAppBrowser) {
            window.cordova.InAppBrowser.open(fileUrl, '_blank', 'location=yes');
        } else {

            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
    }}>Ver Arquivo</a>

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




