import './App.css';
import './bootstrap-4.0.0/dist/css/bootstrap.css';
import './fontawesome-free-5.15.4-web/css/all.css';
import React, { useState,useEffect } from 'react';



function EditScreen({index, onSave, onCancel}){

  function EditScreen({ index, onSave, onCancel }) {
    const [examList, setExamList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
  
    useEffect(() => {
      const savedExams = JSON.parse(localStorage.getItem('exam')) || [];
      setExamList(savedExams);
      setIsLoaded(true);
    }, []);
  
    const editDiv = document.getElementsByClassName("editarDiv")[0];
    const primeiraLinha = document.getElementById("primeira-linha");
    const conteudo = document.getElementById("conteudo");
  
    function returnMain() {
      editDiv.style.animation = "popupHide 0.5s ease-in";
      primeiraLinha.style.transition = "transform 0.5s ease-out";
      conteudo.style.transition = "transform 0.5s ease-out";
      primeiraLinha.style.transform = 'translateY(1vh)';
      conteudo.style.transform = 'translateY(2vh)';
      setTimeout(() => {
        primeiraLinha.style.transform = 'translateY(-1vh)';
        conteudo.style.transform = 'translateY(-2vh)';
        onCancel();
      }, 500);
    }
  
    function saveExam(event) {
      event.preventDefault();
      returnMain();
    }
  
    if (!isLoaded) {
      return <div>Loading...</div>; // Opcional: Você pode colocar um spinner aqui
    }
  
    const exam = examList[index];
  
    return (
      <div className='editarDiv'>
        <form onSubmit={saveExam}>
          <h2>Adicionar Exame</h2>
          <span>Nome do exame:* <input type='text' value={exam.nomeExame} name='nomeExame' required maxLength="30" autoComplete="new-password" /></span>
          <span>Data do exame:* <input type='date' value={exam.dataExame} name='dataExame' required max={new Date().toISOString().split('T')[0]} /></span>
          <span>Nome da clínica:* <input type='text' value={exam.nomeClinica} name='nomeClinica' required maxLength="30" autoComplete="new-password" /></span>
          <span>Nome do doutor:* <input type='text' value={exam.nomeDoutor} name='nomeDoutor' required maxLength="30" autoComplete="new-password" /></span>
          <span>Arquivo do exame:* <input type='file' name='arquivoExame' required /></span>
          <span>Observações: <input type='text' value={exam.observacoes} name='observacoes' maxLength="100" autoComplete="new-password" /></span>
          <button type='submit'>Salvar</button>
          <button type='button' onClick={returnMain}>Voltar</button>
        </form>
      </div>
    );
  }
}

function AdicionarScreen({ onSave, onCancel }) {
  var adcDiv;
  var primeiraLinha;
  var conteudo;
  useEffect(() => {
    adcDiv = document.getElementsByClassName("adicionarDiv")[0];
    primeiraLinha = document.getElementById("primeira-linha");
    conteudo = document.getElementById("conteudo")
    

  }, []);
  function returnMain() {
    adcDiv.style.animation = "popupHide 0.5s ease-in";
    primeiraLinha.style.transition = "transform 0.5s ease-out";
    conteudo.style.transition = "transform 0.5s ease-out"
    primeiraLinha.style.transform = 'translateY(1vh)';
    conteudo.style.transform = 'translateY(2vh)';
      setTimeout(() => {
        primeiraLinha.style.transform = 'translateY(-1vh)';
        conteudo.style.transform = 'translateY(-2vh)';
        onCancel();
      }, 500); 

  }

      function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
          reader.onabort = error => reject(error)
          reader.readAsDataURL(file);
        });
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
        listExamData.push(examData);
        localStorage.setItem('exam', JSON.stringify(listExamData));
        returnMain()
        onSave(listExamData);

      }
  
  return (
    <div className='adicionarDiv'>
      <form onSubmit={saveExam}>
        <h2>Adicionar Exame</h2>
        <span>Nome do exame:* <input type='text' name='nomeExame' required maxLength="30" autoComplete="new-password" /></span>
        <span>Data do exame:* <input type='date' name='dataExame' required max={new Date().toISOString().split('T')[0]}/></span>
        <span>Nome da clínica:* <input type='text' name='nomeClinica' required maxLength="30" autoComplete="new-password"/></span>
        <span>Nome do doutor:* <input type='text' name='nomeDoutor' required maxLength="30" autoComplete="new-password"/></span>
        <span>Arquivo do exame:* <input type='file' name='arquivoExame' required /></span>
        <span>Observações: <input type='text' name='observacoes' maxLength="100" autoComplete="new-password"/></span>
        <button type='submit'>Salvar</button>
        <button type='button' onClick={returnMain}>Voltar</button>
      </form>
    </div>
  );

}

export default function App() {
  const [display, setDisplay] = useState('homeScreen');
  const [examList, setExamList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);


  useEffect(() => {
    const savedExams = JSON.parse(localStorage.getItem('exam')) || [];
    setExamList(savedExams);
  },[])

  const components = {
    adicionarScreen: () => <AdicionarScreen onSave={setExamList} onCancel={()=>setDisplay('homeScreen')} />,
    editScreen: () => <EditScreen  index={currentIndex} onSave={setExamList} onCancel={()=>setDisplay('homeScreen')} />,

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
  function deleteExam(ind){
    let examItem = document.getElementsByClassName("exam-item")
    examItem[ind].style.animation = "popupHide 0.5s ease-in"
    const updatedExamList = examList.filter((_, index) => index !== ind);
    localStorage.setItem('exam', JSON.stringify(updatedExamList));
    setTimeout(() => {
      setExamList(updatedExamList);
    }, 500); 
   
    
  }
  function filterExam(){

  }
  function findExam(){

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
              <i className="fas fa-filter"></i>
            </span>
          </div>
          <input className="form-control" type="text" placeholder="Pesquisar exames..." />
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
            <p><strong>Arquivo do exame:</strong> <a href={exam.arquivoExame} target="_blank" rel="noopener noreferrer">Ver Arquivo</a></p>
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
    <p>Nenhum exame salvo ainda.</p>
  )}
  </div>


      <button onClick={addExam} className="btn btn-success rounded-circle fixed-bottom m-4 p-3 shadow" id="addButton">
        <i className="fas fa-plus"></i>
      </button>


    </div>
  );
}




