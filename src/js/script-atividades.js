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
            imageUrl: 'https://media.giphy.com/media/2YpTTV69fQsH5BqxSm/giphy.gif',
            imageWidth: 150,
            text: 'Assim você vai longe!',
            confirmButtonText: 'Continuar aprendendo'
          }).then((result) => {
            if (result.isConfirmed) {
              this.currentQuestionIndex = this.currentQuestionIndex + 1;
              this.currentQuestion = this.questions[this.currentQuestionIndex]
            }
          })
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
        } else {
          Swal.fire({
            title: 'Não foi dessa vez...',
            imageUrl: 'https://i.pinimg.com/originals/3e/b5/f3/3eb5f331f37731fb9ce9def5cbf445fe.gif',
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

            this.questions = data.map(x => ({
              ...x,
              questions: getQuestions(x)
            }))
            
            this.currentQuestion = this.questions[0]
            this.level = id;

          })
          .catch(err => {
            console.log('err', err)
          })
      })
    }
  })
});
