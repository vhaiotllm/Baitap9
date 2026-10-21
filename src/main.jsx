import React, { Component } from 'react';
import { createRoot } from "react-dom/client";

class StudentForm extends Component {
  state = { name: '', email: '', major: 'CNTT', gpa: '', errors: {} };

  change = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();
    let errors = {};
    let { name, email, gpa } = this.state;

    if (name.trim().length < 3) errors.name = 'Tên phải từ 3 ký tự';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'Email không hợp lệ';
    if (gpa.trim() === '' || isNaN(Number(gpa)) || Number(gpa) < 0 || Number(gpa) > 4)
      errors.gpa = 'GPA phải từ 0 đến 4';

    this.setState({ errors });
    if (Object.keys(errors).length > 0) return;

    this.props.add({
      name: name.trim(),
      email: email.trim(),
      major: this.state.major,
      gpa: Number(gpa)
    });
    this.setState({ name: '', email: '', major: 'CNTT', gpa: '', errors: {} });
  };

  render() {
    let { name, email, major, gpa, errors } = this.state;
    return (
      <form onSubmit={this.submit} noValidate>
        <h2>Thêm sinh viên</h2>
        <input name="name" placeholder="Họ tên" value={name} onChange={this.change} />
        <p className="loi">{errors.name}</p>
        <input name="email" placeholder="Email" value={email} onChange={this.change} />
        <p className="loi">{errors.email}</p>
        <select name="major" value={major} onChange={this.change}>
          <option>CNTT</option>
          <option>ATTT</option>
          <option>ĐTVT</option>
        </select>
        <input name="gpa" type="number" step="0.1" placeholder="GPA" value={gpa} onChange={this.change} />
        <p className="loi">{errors.gpa}</p>
        <button>Thêm</button>
      </form>
    );
  }
}

class StudentList extends Component {
  render() {
    if (this.props.students.length === 0) return <p>Chưa có sinh viên</p>;
    return (
      <ul>
        {this.props.students.map(s => (
          <li key={s.id}>
            {s.name} - {s.email} - {s.major} - GPA: {s.gpa}
            <button onClick={() => {
              if (window.confirm('Bạn có muốn xóa sinh viên này?')) this.props.remove(s.id);
            }}>Xóa</button>
          </li>
        ))}
      </ul>
    );
  }
}

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = { time: new Date() };
    console.log('Clock: constructor');
  }

  componentDidMount() {
    console.log('Clock: componentDidMount');
    this.timer = setInterval(() => this.setState({ time: new Date() }), 1000);
  }

  componentDidUpdate() {
    console.log('Clock: componentDidUpdate');
  }

  componentWillUnmount() {
    console.log('Clock: componentWillUnmount');
    clearInterval(this.timer);
  }

  render() {
    console.log('Clock: render');
    return <h2>{this.state.time.toLocaleTimeString('vi-VN')}</h2>;
  }
}

class App extends Component {
  state = { students: [], search: '', showClock: true, count: 0 };
  nextId = 1;

  componentDidMount() {
    document.title = 'Số lần bấm: 0';
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count)
      document.title = 'Số lần bấm: ' + this.state.count;
  }

  add = (student) => {
    this.setState(prev => ({
      students: [...prev.students, { ...student, id: this.nextId++ }]
    }));
  };

  remove = (id) => {
    this.setState(prev => ({
      students: prev.students.filter(s => s.id !== id)
    }));
  };

  render() {
    let { students, search, showClock, count } = this.state;
    let ds = students.filter(s => s.name.toLowerCase().includes(search.trim().toLowerCase()));
    return (
      <div>
        <h1>Quản lý sinh viên</h1>
        <StudentForm add={this.add} />
        <h2>Danh sách sinh viên ({students.length})</h2>
        <input placeholder="Tìm theo tên" value={search}
          onChange={e => this.setState({ search: e.target.value })} />
        <StudentList students={ds} remove={this.remove} />

        <div className="dongho">
          <h2>Đồng hồ - Lifecycle</h2>
          {showClock && <Clock />}
          <button onClick={() => this.setState(prev => ({ showClock: !prev.showClock }))}>
            {showClock ? 'Ẩn' : 'Hiện'} đồng hồ
          </button>
          <p>Số lần bấm: {count}</p>
          <button onClick={() => this.setState(prev => ({ count: prev.count + 1 }))}>Bấm</button>
        </div>
      </div>
    );
  }
}

createRoot(document.getElementById('root')).render(<App />);


