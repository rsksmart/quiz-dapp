var app = new Vue({
    el: '#app',
    data: {
      answers: 0,
      hits: 0,
      questions: []
    },
      mounted () {
      axios.get('questions.json')
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
          // TODO: make request
          if (answer === question.answer) {
            this.hits++
            element.classList.add('right-answer')
          } else {
            element.classList.add('wrong-answer')
          }
          this.answers++
          if (this.answers === this.questions.length) {
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