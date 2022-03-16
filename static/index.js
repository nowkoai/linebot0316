Vue.use(window["vue-js-modal"].default);

// ★AWSコンソールを確認）API GatewayのURLを記述して、再度デプロイ（sls deploy）
const apiurl = "https://1cqmawpakl.execute-api.us-east-1.amazonaws.com/dev/todos"


// CRUD処理
const vue = new Vue({
  el: "#app",
  data: {
    title: 'センサーのデータ表示（★受け取り状況）',

    form: {
      id: '',
      body: '受取待ち',
      body2: 'A宅',
      updatedAt: ''
    },

    // todos: '',
    todos: [],

    editIndex: -1,
    createFlag: true
  },

  methods: {
    // datenow() {
    //   let today = new Date();
    //   console.log("today: " + today)
    //
    //   let year = today.getFullYear();
    //   // let month = today.getMonth() + 1;
    //   // let date = today.getDate();
    //   let month = ("0" + (today.getMonth()+1)).slice(-2)
    //   let day = ("0" + today.getDate()).slice(-2)
    //
    //   let hour = today.getHours();
    //   let minute = today.getMinutes();
    //   let second = today.getSeconds();
    //   let millisecond = today.getMilliseconds();
    //   console.log(year)
    //
    //   data = year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':' + second;
    //   console.log(data)
    //   return data
    // },

    // ##############################################
    // ★モーダルを開く for 登録
    // ##############################################
    showModal() {
      this.createFlag = true;
      this.resetForm();
      this.$modal.show('todo-modal');
    },


    // ##############################################
    // データ追加
    // ##############################################
    registerPerson() {
      let todo = Object.assign({}, this.form);

      //////////////////////////////////////////////////////////
      // 日付セット
      let today = new Date();
      console.log("today: " + today)

      let year = today.getFullYear();
      // let month = today.getMonth() + 1;
      // let date = today.getDate();
      let month = ("0" + (today.getMonth()+1)).slice(-2)
      let day = ("0" + today.getDate()).slice(-2)

      // let hour = today.getHours();
      // let minute = today.getMinutes();
      // let second = today.getSeconds();
      let hour = ("0" + today.getHours()).slice(-2)
      let minute = ("0" + today.getMinutes()).slice(-2)
      let second = ("0" + today.getSeconds()).slice(-2)
      let millisecond = today.getMilliseconds();

      var datedate = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
      console.log("datedate: " + datedate)
      //////////////////////////////////////////////////////////
      todo.updatedAt = datedate
      //////////////////////////////////////////////////////////


      //////////////////////////////////////////////////////////
      // ★★dynamo-ID付与
      todo.id = String(new Date().getTime())
      console.log("id: " + todo.id)
      //////////////////////////////////////////////////////////
      console.log(todo)
      //////////////////////////////////////////////////////////

      axios
        .post(apiurl,
          {
            id: todo.id,
            body: todo.body,
            body2: todo.body2,
            updatedAt: todo.updatedAt
          }
        )
        .then(response => this.todos.unshift(todo))
        .then(console.log(todo))
        .then(this.nowko())
        .catch(function (error) {
          alert('データ登録に失敗しました！！');
          console.log(error);
        });


      // this.todos.push(todo);
      this.$modal.hide('todo-modal');
      this.resetForm();

      // setTimeout(this.nowko(), 5000);
    },

    resetForm() {
      this.form.id = '';
      this.form.body = '受取待ち';
      this.form.body2 = 'A宅';
      this.form.updatedAt = '';
    },
    // ##############################################


    // ##############################################
    // データ取得（POSTから呼び出しあり）
    // ##############################################
    nowko() {
      axios
        .get(apiurl)
        .then(response => (this.todos = response.data))
        .catch(function (error) {
          alert('データの取得に失敗しました！');
          console.log(error);
        });

      console.log("nowko function")
    },

    // ##############################################
    // データ削除
    // ##############################################
    deletePerson(todo) {
      const params = { id: todo.id };
      const id = todo.id;
      axios.request({
        method: 'delete',
        url: apiurl + id,
        data: { id: todo.id }
      })
        .then(response => {
          const index = this.todos.indexOf(todo);
          this.todos.splice(index, 1);
          console.log('deleted successfully');
          console.log(id);
        })
        .catch(function (error) {
          alert('ブラウザをリロードしてから削除してください！');
          console.log(error);
        });
    },


    // ##############################################
    // ★モーダルを開く for 更新
    // ##############################################
    editPerson(todo) {
      this.createFlag = false,
      this.editIndex = this.todos.indexOf(todo);
      this.form = Object.assign({}, todo);
      // axios.put()
      this.$modal.show('todo-modal');
    },

    // ##############################################
    // データ更新
    // ##############################################
    updatePerson() {
      const id = this.form.id;
      console.log(id);
      axios
        .put(apiurl + id,
          {
            id: this.form.id,
            body: this.form.body,
            body2: this.form.body2,
            updatedAt: this.form.updatedAt
          }
        )
        .then(response => Object.assign(this.todos[this.editIndex], this.form))
        .catch(function (error) {
          alert('ブラウザをリロードしてから更新してください！');
          console.log(error);
        });
      this.$modal.hide('todo-modal');
    },
    cancel() {
      this.$modal.hide('todo-modal');
    }
  },


  // ##############################################
  // 初回データ取得
  // ##############################################
  mounted() {
    axios
      .get(apiurl)
      .then(response => (this.todos = response.data))
      .catch(function (error) {
        alert('データの取得に失敗しました！');
        console.log(error);
      });
  },

  computed: {
    reverseItems() {
      // return this.todos.slice().reverse();

      return this.todos.sort((a, b) => {
        // return a.id - b.id;
        return b.id - a.id;
      })
    }
  }


});
