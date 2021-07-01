//const nodemon = require("nodemon")

function main() {
	const burgerMenu = document.getElementById("burger")
	const navbarMenu = document.getElementById("menu")

	// Responsive Navbar Toggle
	burgerMenu.addEventListener("click", function () {
		navbarMenu.classList.toggle("active")
		burgerMenu.classList.toggle("active")
	})
}

const getQuestions = (question) => {
  const withImg = question.contemImgRes ? '_img' : '';
  return ['A', 'B', 'C', 'D'].map(x => ({
    question: x.toLowerCase(),
    description: question[`resposta${x}${withImg}`],
    isImage: Boolean(question.contemImgRes),
    isImageQuestion: Boolean(question.contemImgDesc),
    ImageQuestion: question.descricaoImg
  }))
}

window.addEventListener('DOMContentLoaded', (event) => {
  main();
  var app = new Vue({
    el: '#app',
    data: {
      questions: [],
      currentQuestionIndex: 0,
      currentQuestion: {},
      level: 0
    },
    methods: {
      selectAnswer: function(item) {
        if (item.question === this.currentQuestion.respostaCorreta) {
          Swal.fire({
            title: 'Muito bem!',
            imageUrl: '../img/happy.gif',
            imageWidth: 150,
            text: 'Assim você vai longe!',
            confirmButtonText: 'Continuar aprendendo'
          }).then((result) => {
            if (result.isConfirmed) {
              //salvando última questão nos cookies, caso o user volte para a home
              //localStorage.setItem('lastQuestionIndex', this.currentQuestionIndex + 1); 
              //localStorage.setItem('lastLevel', this.questions[this.currentQuestionIndex + 1].nivel); 
              this.currentQuestionIndex = this.currentQuestionIndex + 1;
              this.currentQuestion = this.questions[this.currentQuestionIndex]

              if (!this.currentQuestion) {
                Swal.fire({
                  title: 'Parabéns!',
                  imageUrl: 'https://i.pinimg.com/originals/b8/4a/3e/b84a3eb595247aae0a6095943d24edf4.gif',
                  imageWidth: 150,
                  text: 'Você respondeu todas as perguntas dessa atividade!',
                  confirmButtonText: 'Fazer outra atividade',
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.href = '/';
                  }
                })
              }
            }
          })
        } else {
          Swal.fire({
            title: 'Não foi dessa vez...',
            imageUrl: '../img/sad.gif',
            imageWidth: 150,
            text: 'mas estamos torcendo por você!',
            showCancelButton: true,
            confirmButtonColor: '#5cb85c',
            cancelButtonColor: '#7367f0',
            confirmButtonText: 'Tentar novamente agora',
            cancelButtonText: 'Tentar depois'
          }).then((result) => {
            if (result.isConfirmed) {

            }else{
              //salvando última questão nos cookies, caso o user volte para a home
              //localStorage.setItem('lastQuestionIndex', this.currentQuestionIndex + 1); 
              //localStorage.setItem('lastLevel', this.questions[this.currentQuestionIndex + 1].nivel); 

              this.questions.push(this.questions[this.currentQuestionIndex])
              this.currentQuestionIndex = this.currentQuestionIndex + 1;
              this.currentQuestion = this.questions[this.currentQuestionIndex]
            }
          })
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        const id = location.search.split('=')[1]
        fetch(`/api/atividades/${id}`)
          .then(res => res.json())
          .then(data => {

            /*
            this.questions = data.map(x => ({
              ...x,
              questions: getQuestions(x)
            }))*/

            console.log("data")
            console.log(data)
            console.log(data.length)

           /* for(var i = localStorage.getItem('lastQuestionIndex') - 1; i <  data.length; i++){
              console.log("comecei")
              console.log(data[0])
            }*/

            this.questions = data.map(x => {
              console.log(x);
              return ({
                        ...x,
                        questions: getQuestions(x)
                    })
            })
            
            this.currentQuestion = this.questions[0]
              this.level = id;
              /*
            if(localStorage.getItem('lastQuestionIndex') && localStorage.getItem('lastLevel') == id){
              
              console.log("já tava fazendo antes")
              this.currentQuestion = this.questions[localStorage.getItem('lastQuestionIndex')]
              this.level = localStorage.getItem('lastLevel');
            }else{
              this.currentQuestion = this.questions[0]
              this.level = id;
            }*/
          })
          .catch(err => {
            console.log('err', err)
          })
      })
    }
  })
});
