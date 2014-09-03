/** @jsx React.DOM */

var Example2 = React.createClass({
  handleCancel: function() { this.refs.modal.close(); },

  render: function() {
    var modal = null;
    modal = (
      <BootstrapEditor
        ref="modal"
        confirm="OK"
        cancel="Cancel"
        delete="Delete"
        onCancel={this.handleCancel}
        onConfirm={this.closeModal}
        title="Hello, Bootstrap!">
        <div><DomNode node={this.props.formContent} /></div>
      </BootstrapEditor>
    );

    return (
      <div className="example">
        {modal}
        <BootstrapButton onClick={this.openModal} text="Demo modal (from DOM)" icon="glyphicon-star" size="btn-lg" />
      </div>
    );
  },
  openModal: function() { this.refs.modal.open(); },
  closeModal: function() { this.refs.modal.close(); }
});

var trg = $("#btnStar");
var bdy = $("#content");

//var myModal = $("#myModal");//.clone(true, true);
//var myModal = document.getElementById("news");
//var myModal = document.getElementById("myModal");
//myModal.style.visibility= "visible";
//myModal.style.display= "block";
//myModal.aria-hidden='false';
//var myModaljq = $("#myModal");//.clone(true, true);
var myModaljq = $("#editDiv");//.clone(true, true);
//myModaljq.id =("a123react4");
//myModaljq.key = "myModalKey";
//myModaljq.show();
myModaljq.attr("aria-hidden", false);
myModaljq.removeClass("modal");

//React.renderComponent(<ModalTrigger trigger={trg} header="hdr" body={bdy} footer="ftr" />,  document.getElementById('example2'));

React.renderComponent(<Example2 formContent={myModaljq[0]} />,  document.getElementById('example3'));
