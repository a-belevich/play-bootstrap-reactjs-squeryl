/** @jsx React.DOM */

var ModalTrigger = React.createClass({
    handleClick: function(e) {
        $(this.refs.payload.getDOMNode()).modal();
    },
    render: function() {
        var Trigger = this.props.trigger;
        return (<div onClick={this.handleClick}>
            <Trigger/>
            <Modal ref="payload"
                header={this.props.header}
                body={this.props.body}
                footer={this.props.footer}>
            </Modal>;
        </div>);
    },
});
 
var Modal = React.createClass({
    componentDidMount: function() {
        // Initialize the modal, once we have the DOM node
        // TODO: Pass these in via props
        $(this.getDOMNode()).modal({background: true, keyboard: true, show: false});
    },
    componentWillUnmount: function() {
        $(this.getDOMNode()).off('hidden');
    },
    // This was the key fix --- stop events from bubbling
    handleClick: function(e) {
        e.stopPropagation();
    },
    render: function() {
        var Header = this.props.header;
        var Body = this.props.body;
        var Footer = this.props.footer;
        return (
            <div onClick={this.handleClick} className="modal fade" role="dialog" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <Body className="modal-header"/>
                    </div>
                </div>
            </div>
        );
    }
});

var Hello = React.createClass({
  render: function() {
    return (<h1>1Hello, world!</h1>);
  }
});

React.renderComponent(<Hello />,  document.getElementById('example'));

var trg = $("#btnStar");
var bdy = $("#content");

//React.renderComponent(<ModalTrigger trigger={trg} header="hdr" body={bdy} footer="ftr" />,  document.getElementById('example2'));

