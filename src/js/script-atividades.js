const LS = {
  get: (key) => {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null;
  },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  remove: (key) => localStorage.removeItem(key),
}

const debug = (yes) => LS.set('debug', yes ? 1 : 0);

const getFromCache = (level) => LS.get(level)
const setToCache = (level, { items, index }) => {
  LS.set(level, { items, index });
}
const removeFromCache = level => LS.remove(level);

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
  
const getDataByLevel = async(level) => {
  const cached = getFromCache(level);
  
  if (cached) {
    console.log('from cache')
    return cached;
  }

  const res = await fetch(`/api/atividades/${level}`);
  const json = await res.json();

  const items = json.map(x => ({ ...x, isCorrect: false, questions: getQuestions(x) }));
  const index = 0;

  setToCache(level, { items, index });
  console.log('from server')
  return { items, index };
}

const getNextIndex = (array, index) => {
  const item = array[index]
  if (!item) {
    return getNextIndex(array, 0);
  }

  if (item.isCorrect) {
    return getNextIndex(array, index + 1);
  }

  return index;
}

const modalEndGame= cb => Swal.fire({
  title: 'Parabéns!',
  imageUrl: 'https://i.pinimg.com/originals/b8/4a/3e/b84a3eb595247aae0a6095943d24edf4.gif',
  imageWidth: 150,
  text: 'Você respondeu todas as perguntas dessa atividade!',
  confirmButtonText: 'Fazer outra atividade',
}).then(cb)

const modalCorrect = cb => Swal.fire({
  title: 'Muito bem!',
  imageUrl: '../img/happy.gif',
  imageWidth: 150,
  text: 'Assim você vai longe!',
  confirmButtonText: 'Continuar aprendendo'
}).then(cb)

const modalTryAgain = cb => Swal.fire({
  title: 'Não foi dessa vez...',
  imageUrl: '../img/sad.gif',
  imageWidth: 150,
  text: 'mas estamos torcendo por você!',
  showCancelButton: true,
  confirmButtonColor: '#5cb85c',
  cancelButtonColor: '#7367f0',
  confirmButtonText: 'Tentar novamente agora',
  cancelButtonText: 'Tentar depois'
}).then(cb)

function main() {
	const burgerMenu = document.getElementById("burger")
	const navbarMenu = document.getElementById("menu")

	burgerMenu.addEventListener("click", function () {
		navbarMenu.classList.toggle("active")
		burgerMenu.classList.toggle("active")
	})
}


window.addEventListener('DOMContentLoaded', () => {
  main();

  new Vue({
    el: '#app',
    data: {
      level: 0,
      index: 0,
      items: []
    },
    computed: {
      current: function() {
        return this.items[this.index] || { titulo: '', descricao: '', questions: [] }
      },
      debug: function() {
        if (+LS.get('debug') !== 1) return [];
        return this.items.reduce((acc, x) => {
          const index = x.questions.findIndex(y => y.question === x.respostaCorreta)
          const isCurrent = +this.current.id === +x.id ? 'border-color: #fff;' : '';
          return `${acc}<div style="padding: 12px;border: solid 2px #000;${isCurrent}"><img style="height: 30px!important; opacity: ${x.isCorrect ? '0.2' : '1'}" src="/img/${x.questions[index].description}"/></div>`
        }, '')
      }
    },
    methods: {
      isEndGame: function() {
        return this.items.every(item => item.isCorrect);
      },
      isCorrect: function(resposta) {
        return resposta === this.current.respostaCorreta;
      },
      continue: function(items, index) {
        const nextIndex = getNextIndex(items, index);

        setToCache(this.level, { items, index: nextIndex });

        this.index = nextIndex;
        this.items = items;

        console.log('continue')
      },
      congratulations: function() {
        modalCorrect(() => {
          this.continue(this.items, this.index + 1);
        })
      },
      tryAgain: function() {
        console.log('tryAgain')
        modalTryAgain(({ isConfirmed }) => {
          if (isConfirmed) return;
          this.continue(this.items, this.index + 1);
        })
      },
      endGame: function() {
        console.log('endGame')
        removeFromCache(this.level);
        modalEndGame(() => {
          window.location.href = '/';
        })
      },
      selectAnswer: function(resposta) {
        if (this.isCorrect(resposta)) {
          this.current.isCorrect = true;

          if (this.isEndGame()) {
            this.endGame();
            return;
          }

          this.congratulations();
          return;
        }

        this.tryAgain(true);
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        const level = Number(location.search.split('=')[1]);
        if (!level || level < 1 || level > 5) {
          window.location.href = '/';
          return;
        }

        this.level = level;

        getDataByLevel(level)
          .then(data => {
            const { items, index } = data;
            this.continue(items, index)
          })
      })
    }
  })
});
