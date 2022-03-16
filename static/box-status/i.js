Vue.use(window["vue-js-modal"].default);

// ★AWSコンソールを確認）API GatewayのURLを記述して、再度デプロイ（sls deploy）
// const apiurl = "https://l1ubaf8dk1.execute-api.ap-northeast-1.amazonaws.com/dev/todos/"
const apiurl = "https://rcvn8ewl95.execute-api.us-east-1.amazonaws.com/dev/boxstatus/"


// CRUD処理
const vue = new Vue({
  el: "#app",
  data: {
    title: '置き配Boxステータス',

    // todos: '',
    todos: [],

    // editIndex: -1,
    // createFlag: true
  },

  methods: {
    // datenow() {
    //   let today = new Date();
    //
    //   let year = today.getFullYear();
    //   let month = today.getMonth() + 1;
    //   let date = today.getDate();
    //
    //   let hour = today.getHours();
    //   let minute = today.getMinutes();
    //   let second = today.getSeconds();
    //   let millisecond = today.getMilliseconds();
    //   console.log(year)
    //
    //   data = year + '-' + month + '-' + date + '_' + hour + '-' + minute + '-' + second;
    //   console.log(data)
    //   return data
    // },

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

});
