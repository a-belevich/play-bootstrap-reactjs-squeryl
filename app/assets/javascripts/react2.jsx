/** @jsx React.DOM */

var BootstrapButton = React.createClass({
  render: function() {
    var iconSpan = (this.props.icon == null) ? null : (<span className={"glyphicon " +this.props.icon}> </span>);
    var btnColor = (this.props.color == null) ? "btn-default" : this.props.color;
    var btnSize = (this.props.size == null) ? " " : this.props.size;
    var btnStyle = "btn " + btnColor + " " + btnSize;
    return (
      <button type="button" className={btnStyle} onClick={this.props.onClick} >
        {iconSpan}
        {this.props.text}
      </button>
    );
  }
  
// transferPropsTo() is smart enough to merge classes provided to this component.
//    return this.transferPropsTo(
//      <a href="javascript:;" role="button" className="btn">
//        {this.props.children}
//      </a>
//    );
});

var BootstrapModal = React.createClass({
//// The following two methods are the only places we need to integrate with Bootstrap or jQuery!
  componentDidMount: function() {
//// When the component is added, turn it into a modal
    $(this.getDOMNode())
      .modal({backdrop: "static", keyboard: true, show: false})
    },
  componentWillUnmount: function() {
    $(this.getDOMNode()).off("hidden", this.handleHidden);
  },
  close: function() {
    $(this.getDOMNode()).modal('hide');
  },
  open: function() {
    $(this.getDOMNode()).modal('show');
  },
  render: function() {
    var confirmButton = null;
    var cancelButton = null;
    if (this.props.confirm) {
      confirmButton = ( <BootstrapButton onClick={this.handleConfirm} className="btn-primary" text={this.props.confirm} color="btn-primary" /> );
}
    if (this.props.cancel) {
      cancelButton = ( <BootstrapButton onClick={this.handleCancel} text={this.props.cancel} /> );
    }

//      <div className="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    return (
      <div className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.handleCancel} dangerouslySetInnerHTML={{__html: '&times'}} />
              <h3>{this.props.title}</h3>
            </div>
            <div className="modal-body"> {this.props.children} </div>
            <div className="modal-footer"> {confirmButton} {cancelButton} </div>
          </div>
        </div>
      </div>
    );
  },
  handleCancel: function() {
    if (this.props.onCancel) {
       this.props.onCancel();
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }
});

var Example = React.createClass({
  handleCancel: function() {
//    if (confirm('Are you sure you want to cancel?')) 
    {
      this.refs.modal.close();
    }
  },

  render: function() {
    var modal = null;
    modal = (
      <BootstrapModal
        ref="modal"
        confirm="OK"
        cancel="Cancel"
        onCancel={this.handleCancel}
        onConfirm={this.closeModal}
        title="Hello, Bootstrap!">
        This is a React component powered by jQuery and Bootstrap!
      </BootstrapModal>
    );

    return (
      <div className="example2">
        {modal}
        <BootstrapButton onClick={this.openModal} text="Open modal" icon="glyphicon-star" size="btn-lg" />
      </div>
    );
  },
  openModal: function() {
    this.refs.modal.open();
  },
  closeModal: function() {
    this.refs.modal.close();
  }
});

var trg = $("#btnStar");
var bdy = $("#content");

//React.renderComponent(<ModalTrigger trigger={trg} header="hdr" body={bdy} footer="ftr" />,  document.getElementById('example2'));

React.renderComponent(<Example />,  document.getElementById('example2'));
