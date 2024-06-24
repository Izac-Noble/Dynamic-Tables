import React, { Component } from 'react';
import './App.css';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: false,
      isError: false,
      searchTerm: '', //state variable for search term
      sortBy: '', // this is sorting by firstname
      sortOrder: 'asc',// ascending order or ...
      currentPage: 1,
      usersPerPage: 10, // five people per page
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    try {
      const response = await fetch('https://jsonplaceholder.org/users');

      if (response.ok) {
        const users = await response.json();
        this.setState({ users, isLoading: false });
      } else {
        this.setState({ isError: true, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ isError: true, isLoading: false });
    }
  }

  handleSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSort = (key) => {
    const {sortBy, sortOrder} = this.state

    if (key === sortBy) {
      this.setState({sortOrder: sortOrder ==='asc'? 'desc': 'asc'});//this toggles the sort order if the same is clicked
    } else {
      this.setState({sortBy:key, sortOrder:'asc'});//this sets a new sort key and defaults to ascending order
    }
  }

  handlePageChange = (pageNumber) => {
  const { usersPerPage } = this.state;
  const totalPages = Math.ceil(this.state.users.length / usersPerPage);

  if (pageNumber < 1 || pageNumber > totalPages) {
    return;
  }

  this.setState({ currentPage: pageNumber });
};

  renderTableHeader = () => {
    if (this.state.users.length === 0) return null;

    return Object.keys(this.state.users[0]).map(attr => (
       <th key={attr} onClick={() => this.handleSort(attr)}>
        {attr.toUpperCase()}{' '}
        {attr === this.state.sortBy && (this.state.sortOrder === 'asc' ? '↑' : '↓')}
      </th>
    ));
  };

  renderTableRows = () => {
    const { users, searchTerm, sortBy, sortOrder , currentPage, usersPerPage } = this.state;

    // Filter users based on search term
    const filteredUsers = users.filter((user) =>
      Object.values(user).some( //returns an array of all the property values
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Sorting logic
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const comparison = sortOrder === 'asc' ? 1 : -1;
      if (a[sortBy] < b[sortBy]) {
        return -comparison;
      }
      if (a[sortBy] > b[sortBy]) {
        return comparison;
      }
      return 0;
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);


    return currentUsers.map(user => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.firstname}</td>
        <td>{user.lastname}</td>
        <td>{user.email}</td>
        <td>{user.birthDate}</td>
        <td>{user.login ? user.login.username : ''}</td>
          <td>{user.address ? user.address.street : ''}</td>
        <td>{user.phone}</td>
        <td>{user.website}</td>
        <td>{user.company ? user.company.name : ''}</td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { users, currentPage, usersPerPage } = this.state;

    return (
    <div className="pagination">
      <button
        onClick={() => this.handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous page
      </button>
      
      <button
        onClick={() => this.handlePageChange(currentPage + 1)}
        disabled={currentPage === Math.ceil(users.length / usersPerPage)}
      >
        Next page
      </button>
    </div>
  );
};

  render() {
    const { users, isLoading, isError, searchTerm } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (isError) {
      return <div>Error...</div>;
    }

    return (
      <div className="user-table-container">
        <input
          type="text"
          value={searchTerm}
          onChange={this.handleSearchChange}
          placeholder="Search..."
        />
        {users.length > 0 ? (
        <>
          <table className="user-table">
            <thead>
              <tr>{this.renderTableHeader()}</tr>
            </thead>
            <tbody>{this.renderTableRows()}</tbody>
          </table>
          {this.renderPagination()} 
        </>
        ) : (
          <div>No users</div>
        )}
      </div>
    );
  }
}

export default Table;

