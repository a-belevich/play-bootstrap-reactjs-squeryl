/** @jsx React.DOM */

var ReactListsMixin = {

  getInitialState: function() {
    return { right: [] };
  },
 
  isOnLeftSide: function(item) {
    return (this.state.right.indexOf(item) < 0);
  },
  
  leftItems: function() {
    return this.props.data.items.filter(this.isOnLeftSide);
  },
  
  renderItem: function(item) { return (
    <ReactListsItem key={item.id} item={item} onDoubleClick={this.move} />
//    <div key={item.id} onDblClick={ this.move(item.id)}>{ item.caption }</div>
  );},
  
  move: function(id) {
    var index = this.props.data.items.findIndex(item => item.id === id);
    if (index >= 0)
      this.state.right.push(this.props.data.items[index]);
      this.setState({ right: this.state.right });
  },

  render: function() { return (
    <div className={this.props.width + " reactlists"}>
      <p>{this.props.title}</p>
      <div className={this.props.widthLeft + " reactlist"}>
        { this.leftItems().map(this.renderItem) }
      </div>
      <div className={this.props.widthRight + " reactlist"}>
        { this.state.right.map(this.renderItem) }
      </div>
      <p></p>
    </div>
  );}
};

var ReactListsItem = React.createClass({
  onDoubleClick: function() {
    this.props.onDoubleClick(this.props.item.id);
  },

  render: function() { return (
    <div className="reactlistitem" onDoubleClick={ this.onDoubleClick }>{ this.props.item.caption }</div>
  );}
});

var ReactLists = React.createClass({
  mixins: [ReactListsMixin]
});

