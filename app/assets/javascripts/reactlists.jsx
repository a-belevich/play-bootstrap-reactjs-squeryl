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

  renderLeftItem: function(item) { return this.renderItem(item, "left"); },
  renderRightItem: function(item) { return this.renderItem(item, "right"); },
  
  renderItem: function(item, list) { return (
    <ReactListsItem key={"" + list + item.id} item={item} onDoubleClick={this.move} />
//    <div key={item.id} onDblClick={ this.move(item.id)}>{ item.caption }</div>
  );},
  
  move: function(id) {
    var index = this.state.right.findIndex(item => item.id === id);

    if (index >= 0)
        this.state.right.splice(index, 1);
    else {
      index = this.props.data.items.findIndex(item => item.id === id);
      if (index >= 0)
        this.state.right.push(this.props.data.items[index]);
    }

    this.setState({ right: this.state.right });
  },

  render: function() { return (
    <div className={this.props.width + " reactlists"}>
      <p>{this.props.title}</p>
      <div className={this.props.widthLeft + " reactlist"}>
        { this.leftItems().map(this.renderLeftItem) }
      </div>
      <div className={this.props.widthRight + " reactlist"}>
        { this.state.right.map(this.renderRightItem) }
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

