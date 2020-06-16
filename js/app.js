var app = new Vue({
    el: '#app',
    data: {
      counter: 0,
      answers: [],
      hits: 0,
      questions: []
    },
    mounted () {
      axios.get('http://localhost:8500/bzz-raw:/6ab1d7b2a738796daaeafb4c44afcb643b2f8d3d7e7af706b9e1115c0a69c6c8')
        .then(response => {
          this.questions = response.data.questions
        })
    },
    methods: {
      closeModal: function () {
        document.querySelector('div.modal').classList.remove('is-active')
      },
      selectOption: function (evt) {
        if (evt) {
          document.querySelectorAll('div.answer').forEach(element => {
            element.classList.remove('answer') // disable css hover effect
          })
          const element = evt.target
          const answer = element.dataset.key
          const index =  parseInt(element.dataset.index) + 1
          const question = this.getQuestion(index)
          this.answers.push(answer)
          this.counter++
          if (this.counter === this.questions.length) {
            // show modal and return
            document.querySelector('div.modal').classList.add('is-active')
          }
          setTimeout(function () {
            // trigger click event on <a> next button
            document.querySelector('a[data-nav="next"]').click()
            document.querySelectorAll('div.option-box').forEach(element => {
              element.classList.add('answer') // enable css hover effect
            })
          }, 1000)
        }
      },
      getQuestion: function (index) {
        for (let i = 0; i < this.questions.length; i++) {
          if (index === this.questions[i].id) {
            return this.questions[i]
          }
        }
        return false
      }
    }
  })