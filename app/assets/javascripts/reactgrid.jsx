/** @jsx React.DOM */

var ReactGridMixin = {
  getInitialState: function() {
    return { data: null };
  },
  
  clone: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  openModal: function() { this.refs.modal.open(); },
  closeModal: function() { this.refs.modal.close(); },

  getValue: function(data, column) {
    if (typeof data[column.id] === 'undefined' || data[column.id] == null)
      return null; 
    if (column.get)
      return column.get(data[column.id]);
    return data[column.id];
  },

  setValue: function(data, column, value) {
    if (column.set)
     column.set(data, value);
   else { 
     data[column.id] = value; 
   }
  },

  dataToInput: function(data, column) { 
    var input = this.refs["input" + column.id];
    if (input)
      input.getDOMNode().value = this.getValue(data, column); 
  },
  
  inputToData: function(column, data) { 
    var input = this.refs["input" + column.id];
    if (input)
      this.setValue(data, column, input.getDOMNode().value);
      //    data.caption = this.refs.inputCaption.getDOMNode().value;
  },
  
  
  itemEditor: function() { 
    var initialValue = this.state.data;
    if (!initialValue)
      initialValue = { }

    return (
      <BootstrapEditor
        ref="modal"
        confirm="OK"
        cancel="Cancel"
        delete="Delete"
        onCancel={this.handleCancel}
        onConfirm={this.handleConfirm}
        onDelete={this.handleDelete}
        title={this.props.editorTitle}>
        <form className="form-horizontal non-margined">
        { this.props.columns.map(this.columnEditor) }
        </form>
      </BootstrapEditor>
    );
  },
  
  gridHead: function() { return (
    <thead><tr>
      { this.props.columns.map(function(column) {return (<th key={column.id}>{column.caption}</th>); })}
    </tr></thead>
  );},

  gridFoot: function() { return (
    <tfoot><tr>
      <td colSpan={this.props.columns.length}><BootstrapButton onClick={this.onAddNew} text="Add new" /></td>
    </tr></tfoot>
  );},
  
  
  columnEditor: function(column) { 
    var inputId = "input" + column.id;
    return (
      <div className="form-group" key={"inputGroup" + column.id} >
        <label htmlFor={inputId} className="col-sm-2 control-label">{column.caption}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" id={inputId} ref={inputId} readOnly={column.readOnly} />
        </div>        
      </div>
    ); 
  },
  
  onClick: function(fromLine) {
    this.setState({ data: this.clone(fromLine.props.data) }); 
    if (this.onEdit)
      this.onEdit();
  },
  
  onSaved: function(saved) {
//    console.log(saved);
    var lines = this.props.data.lines;
    var idx = lines.findIndex(function(item) { return (item.id === saved.id); });
//    var idx = lines.findIndex(item => item.id == saved.id; });
    if (idx >= 0)
      lines[idx] = saved;
    else
      lines.push(saved);

    this.setProps( {data: { lines: lines }} );
    this.setState({ data: null });
  },

  onDeleted: function(deleted) {
    var lines = this.props.data.lines;
    var idx = lines.findIndex(function(item) { return (item.id === deleted.id); });
    if (idx >= 0)
      lines.splice(idx, 1);

    this.setProps( {data: { lines: lines }} );
    this.setState({ data: null });
  },
  
  wrapper: function(f) { if (f) return f(); else return null; },

  lineNode: function(line) {
    return this.props.lineNode({grid: this, data: line, onClick: this.onClick, onChange: this.onChange, key: line.id, nodeClass: this.props.nodeClass });
  },

  render: function() {
    return (
    <div className="col-sm-12">
      { this.wrapper(this.itemEditor) }
      <table className="table table-bordered table-striped table-hover" >
        { this.wrapper(this.gridHead) }
        { this.wrapper(this.gridFoot) }
        <tbody>
          {this.props.data.lines.map(this.lineNode)}
        </tbody>
      </table>
    </div>);
  },

  doSave: function(data) {
//	  var obj = this.state.data;
//	  if (obj == null)
//		  return;
	  var sender = this;
	  console.log("Saving: " + JSON.stringify(data) + " to " + this.props.saveTo);
	  jQuery.support.cors = true;
	  $.ajax({
		  type : "PUT",
		  url : this.props.saveTo,
		  data : JSON.stringify(data),
		  contentType : "application/json; charset=utf-8",
		  dataType : "json",
		  success : function(obj) {
//			  console.log("Saved: " + JSON.stringify(data));
			  sender.onSaved(obj);
		  },
		  error : function(msg, url, line) {
//			  console.log("Error: " + JSON.stringify(msg));
			  alert(msg.statusText);
		  }
	  });
  },
  
  doDelete: function(data) {
//	  var obj = this.state.data;
//	  if (obj == null)
//		  return;
	  var sender = this;
	  console.log("Deleting: " + JSON.stringify(data));
	  jQuery.support.cors = true;
	  $.ajax({
		  type : "DELETE",
		  url : this.props.saveTo + "/" + data.id,
		  data : "{}",
		  contentType : "application/json; charset=utf-8",
		  dataType : "json",
		  success : function(obj) {
			  sender.onDeleted(data);
		  },
		  error : function(msg, url, line) {
			  //console.log(JSON.stringify(msg));
			  if(msg && msg.statusText)
				  alert("Error: " + msg.statusText);
		  }
	  });
  },

  onEdit: function() {
    this.openModal();
  },

  onAddNew: function() {
    this.setState({ data: this.clone(this.props.newPrototype) }); 
    this.onEdit();
  },
  
  handleCancel: function() { 
    this.setState({ data: null }); 
    this.editEnd();
    this.refs.modal.close(); 
  },

  handleConfirm: function() { 
    tempData = this.clone(this.state.data);
    this.props.columns.map(this.readInput);
    tempData.id = this.state.data.id; // id cannot be changed, and i dont want to expose it to possible type conversion

    if (this.props.localMode)
      this.onSaved(tempData);
    else
      this.doSave(tempData);

    tempData = null;

    this.editEnd();
    this.refs.modal.close(); 
  },

  handleDelete: function() { 
    if (this.props.localMode)
      this.onDeleted(this.state.data);
    else
      this.doDelete(this.state.data);
    this.editEnd();
    this.refs.modal.close(); 
  },

  getInput: function(column) { return this.refs["input" + column.id]; },
  focusOnFirstEditable: function() {
    var editable = this.props.columns.filter(function(column) {return !column.readOnly; });
    var inputs = editable.map(this.getInput).filter(function(input) {return input;});
    if (inputs.length > 0)
      inputs[0].getDOMNode().focus();
  },
  
  tempData: null,
  readInput: function(column) { return this.inputToData(column, tempData); },
  fillInput: function(column) { return this.dataToInput(this.state.data, column); },
  clearInput: function(column) { return this.dataToInput({}, column); },

  editStart: function() {
    this.props.columns.map(this.fillInput);
    this.focusOnFirstEditable();
  },
  editEnd: function() {
    this.props.columns.map(this.clearInput);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (!this.state.data)
      return;

    $('.selectpicker').selectpicker();
    $(this.refs.modal.getDOMNode()).on('shown.bs.modal', this.editStart);
  }
}

var ReactGridRowMixin = {
  getInitialState: function() {
    return { data: null };
  },

  editClass: function() { return this.nodeClass() + " warning " + this.nodeClass() + "edit"; },
  viewClass: function() { return this.nodeClass() + " " + this.nodeClass() + "view"; },
  
  nodeClass: function() { return this.props.nodeClass; },
  
  render: function() {
    if (this.props.grid.state.data && this.props.grid.state.data.id === this.props.data.id)
      return this.contentEdit(this.editClass());
    else  
      return this.contentView(this.viewClass());
  },

  onClick: function() { this.props.grid.onClick(this) },

  contentView: function(rowClass) {
      return (
        <tr key={this.props.data.id} className={rowClass}>
          { this.props.grid.props.columns.map(this.td) }
        </tr>
      );
  },
  
  //here we're editing items in a modal window, not in place
  contentEdit: function(rowClass) { return this.contentView(rowClass); },

  td: function(column) {
    var style = null;
    if (column.width)
      style = {width: column.width};
      
    var value = this.props.grid.getValue(this.props.data, column);
    return (
      <td style={style} onClick={this.onClick} key={"key" + column.id}>{value}</td>
    );
  }
  
}

// Standard implementations; create new descendants only when needed
var ReactGridRow = React.createClass({ mixins: [ReactGridRowMixin] });
var ReactGrid = React.createClass({ mixins: [ReactGridMixin] });


