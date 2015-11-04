var React = require('react-native');
var Search = require('./../common/search');
var Util = require('./../common/util');
var ServiceURL = require('./../common/service');
var webView = require('./../common/webview');

var {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ScrollView,
  ActivityIndicatorIOS,
  TouchableOpacity
  } = React;

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      keywords: '偏偏喜欢你',
      show: false
    };
  },
  render: function(){
    return(
      <ScrollView style={styles.flex_1}>

        <View style={[styles.search, styles.row]}>
          <View style={styles.flex_1}>
            <Search placeholder="请输入歌曲/歌手名称" onChangeText={this._changeText}/>
          </View>
          <TouchableOpacity style={styles.btn} onPress={this._search}>
            <Text style={styles.fontFFF}>搜索</Text>
          </TouchableOpacity>
        </View>
        {
          this.state.show ?
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow}
              />
            : Util.loading
        }

      </ScrollView>
    );
  },

  componentDidMount: function(){
    this._getData();
  },

  _changeText: function(val){
    this.setState({
      keywords: val
    });
  },

  _search: function(){
    this._getData();
  },

  _renderRow: function(row){
    return (
      <View style={styles.item}>
        <View style={styles.center}>
          <Image style={styles.img} source={{uri: row.image}}/>
        </View>
        <View style={[styles.row]}>
          <Text style={[styles.flex_1,{marginLeft:20}]} numberOfLines={1}>曲目：{row.title}</Text>
          <Text style={[styles.textWidth]} numberOfLines={1}>演唱：{row.author}</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={[styles.flex_1, {marginLeft:20}]} numberOfLines={1}>时间：{row.attrs['pubdate']}</Text>
          <Text style={styles.textWidth} numberOfLines={1}>评分：{row['rating']['average']}</Text>
        </View>
        <View style={[styles.center]}>
          <TouchableOpacity style={[styles.goDou, styles.center]} onPress={this._goDouBan.bind(this, row.title, row.mobile_link)}>
            <Text>去豆瓣</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  _getData: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var that = this;
    var baseURL = ServiceURL.music_search + '?count=10&q=' + this.state.keywords;
    this.setState({
      show: false
    });
    Util.get(baseURL, function(data){
      if(!data.musics || !data.musics.length){
        return alert('音乐服务出错');
      }
      var musics = data.musics;
      that.setState({
        dataSource: ds.cloneWithRows(musics),
        show: true
      });
    }, function(err){
      alert(err);
    });
  },

  _goDouBan: function(title, url){
    this.props.navigator.push({
      component: webView,
      passProps:{
        title: title,
        url: url,
        backName: '音乐'
      }
    });
  }
});

var styles = StyleSheet.create({
  flex_1:{
    flex:1,
    marginTop:5
  },
  search:{
    paddingLeft:5,
    paddingRight:5,
    height:45
  },
  btn:{
    width:50,
    backgroundColor:'#0091FF',
    justifyContent:'center',
    alignItems:'center'
  },
  fontFFF:{
    color:'#fff'
  },
  row:{
    flexDirection:'row'
  },
  img:{
    width:70,
    height:70,
    borderRadius:35
  },
  center:{
    justifyContent:'center',
    alignItems:'center'
  },
  item:{
    marginTop:10,
    borderTopWidth:Util.pixel,
    borderBottomWidth:Util.pixel,
    borderColor:'#ddd',
    paddingTop:10,
    paddingBottom:10
  },
  textWidth:{
    width:120
  },
  goDou:{
    height:35,
    width:60,
    borderWidth:Util.pixel,
    borderColor:'#3082FF',
    borderRadius:3
  }
});
