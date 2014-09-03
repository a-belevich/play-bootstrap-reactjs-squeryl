/** @jsx React.DOM */

var BootstrapButton = React.createClass({
  render: function() {
    var iconSpan = (this.props.icon == null) ? null : (<span className={"glyphicon " +this.props.icon} />);
    var btnColor = (this.props.color == null) ? "btn-default" : this.props.color;
    var btnSize = (this.props.size == null) ? " " : this.props.size;
    var btnStyle = "btn " + btnColor + " " + btnSize;

    return (
      <button type="button" className={btnStyle} onClick={this.props.onClick} >
        {iconSpan} {this.props.text}
      </button>
    );
  }
});  
