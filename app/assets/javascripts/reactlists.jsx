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

  renderLeftItem: function(item) { return this.renderItem(item, "right"); },
  renderRightItem: function(item) { return this.renderItem(item, "left"); },
  
  renderItem: function(item, direction) { return (
    <ReactListsItem key={item.id} item={item} direction={direction} onDoubleClick={this.move} />
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

  getInitialState: function() {
    return { active: false };
  },

  onClick: function() {
    this.props.onDoubleClick(this.props.item.id);
  },
  
  onMouseEnter: function() {
//    $(this.refs.btn.getDOMNode()).fadeTo(1,1);
    this.setState({ active: true });
  },
  
  onMouseLeave: function() {
//    $(this.refs.btn.getDOMNode()).fadeTo(1,0);
    this.setState({ active: false });
  },

  onTouchStart: function() {
    this.setState({ active: true });
  },
  
  onTouchEnd: function() {
    this.setState({ active: false });
  },

  renderButton: function(direction, caption) { 
    var textLeft = ((direction == "right") ? caption : "");
    var textRight = ((direction == "right") ? "" : caption);

    return (
      <button ref="btn" type="button" className="btn btn-default btn-sm btn-block">
        { textLeft } <span className={ "glyphicon glyphicon-chevron-" + direction }></span> { textRight }
      </button>
    );
  },
  
  render: function() {
      var content = (this.state.active) ? this.renderButton(this.props.direction, this.props.item.caption) : this.props.item.caption;
      return (
        <div className="reactlistitem" onClick={ this.onClick } onMouseEnter={ this.onMouseEnter } onMouseLeave={ this.onMouseLeave }
          onTouchStart={ this.onTouchStart } onTouchEnd={ this.onTouchEnd } >
          { content }
        </div>
      );
  }
});

var ReactLists = React.createClass({
  mixins: [ReactListsMixin]
});

