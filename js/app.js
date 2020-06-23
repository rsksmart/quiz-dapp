var app = new Vue({
    el: '#app',
    data: {
      contracts: {},
      counter: 0,
      answers: [],
      hits: 0,
      questions: []
    },
    mounted () {
      this.initWeb3()
        .then(() => {
          console.log('App initialized')
        })
    },
      /*axios.get('http://localhost:8500/bzz-raw:/6ab1d7b2a738796daaeafb4c44afcb643b2f8d3d7e7af706b9e1115c0a69c6c8')
        .then(response => {
          this.questions = response.data.questions
        })
    },*/
    methods: {
      async initWeb3() {
        await axios.get('http://localhost:8500/bzz-raw:/07f1112168025f4c309b652fb364b9ea126728e7b0959338b0bf9f5187d474d0')
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
          web3 = new Web3(this.web3Provider)
          return this.initContract()
      },
      initContract: function (params) {
        return axios.get('../build/contracts/Quiz.json')
          .then(response => {
            const QuizArtifact = response.data
            this.contracts.Quiz = TruffleContract(QuizArtifact)
            // Set the provider for our contract
            this.contracts.Quiz.setProvider(this.web3Provider)
          })
      },
      closeModal: function () {
        document.querySelector('div.modal').classList.remove('is-active')
      },
      selectOption: function (evt) {
        if (evt) {
          document.querySelectorAll('div.answer').forEach(element => {
            element.classList.remove('answer') // disable css hover effect
          })
          const element = evt.target
          const answer = element.dataset.i + 1
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
      sendQuestions: function () {
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
                  document.querySelector('div.modal').classList.remove('is-active')
                  console.log(result.logs[0].args.hitsCounter.c);
              })
              .catch(err => {
                  console.error("=======================")
                  console.error(err)
                  console.error(err.message)
                  console.error(err.stack)
                  console.error('=======================')
              })
        })
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