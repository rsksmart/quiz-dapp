var app = new Vue({
    el: '#app',
    data: {
      counter: 0,
      answers: [],
      hits: 0,
      questions: [],
      contracts: {},
      web3Provider: null
    },
    mounted () {
      this.initWeb3()
        .then(() => {
          console.log('App initialized')
        })
  },
    methods: {
      // get the questions from swarm !!!
      async initWeb3() {
        await axios.get('http://localhost:8500/bzz-raw:/809b82283b3d0c3459fde4340ecb6a7a297b1d25e6cab6084d21257ba29e82c2')
          .then(response => {
            this.questions = response.data.questions
          })

        if (window.ethereum) {
          this.web3Provider = window.ethereum
          try {
            // request account access
            await window.ethereum.enable()
          } catch (error) {
            console.error("user denied account access")
          }
        } else if (window.web3) {
          this.web3Provider = window.web3.currentProvider
        } else {
          this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
        }
        // Inicialized web3 !!!
        web3 = new Web3(this.web3Provider)

        return this.initContract()
      },
      //Load the compiled contract information -> Quiz.json
      initContract: function (params) {
        return axios.get('../build/contracts/Quiz.json')
          .then(response => {
            const QuizArtifact = response.data
            this.contracts.Quiz = TruffleContract(QuizArtifact)
            // Set the provider for our contract
            this.contracts.Quiz.setProvider(this.web3Provider)
          })
      },
      selectOption: function (evt) {
        if (evt) {

          const element = evt.target
          const answer = parseInt(element.dataset.i) + 1
          const index =  parseInt(element.dataset.index) + 1

          element.classList.add('selected')

          const question = this.getQuestion(index)
          this.answers.push(answer)
          this.counter++

          if (this.counter === this.questions.length) {
            const contract = this.contracts.Quiz
            web3.eth.getAccounts((error, accounts) => {
              if (error) {
                console.error(error)
              }

              const account = accounts[0]

              this.contracts.Quiz.deployed()
                .then(instance => {
                  const quizInstance = instance

                  return quizInstance.answerQuestions(this.answers, { from: account })
                })
                .then(result => {
                  this.hits = result.logs[0].args.hitsCounter.c[0]
                  document.querySelector('div.modal').classList.add('is-active')
                })
                .catch(err => {
                  console.error(err)
                })
            })
          }

          setTimeout(function () {
            // trigger click event on <a> next button
            document.querySelector('a[data-nav="next"]').click()
            document.querySelectorAll('div.option-box').forEach(element => {
              element.classList.add('answer') // enable css hover effect
            })
          }, 500) // Wait half second after answer each question.
        }
      },
      closeModal: function () {
        document.querySelector('div.modal').classList.remove('is-active')
      },
      //method that return the question by index
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