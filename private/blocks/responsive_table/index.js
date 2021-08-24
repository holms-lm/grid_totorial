function responsiveTable() {
  if ($('.js--responsive_table__data').length) {
    const headertext = [];
    const headers = document.querySelectorAll('.js--responsive_table__data th');
    const tablebody = document.querySelector('.js--responsive_table__data tbody');

    for (let i = 0; i < headers.length; i += 1) {
      const current = headers[i];
      headertext.push(current.textContent.replace(/\r?\n|\r/, ''));
    }
    // eslint-disable-next-line no-cond-assign
    for (let i = 0, row; (row = tablebody.rows[i]); i += 1) {
      // eslint-disable-next-line no-cond-assign
      for (let j = 0, col; (col = row.cells[j]); i += 1) {
        col.setAttribute('data-th', headertext[j]);
      }
    }
  }
}

export default responsiveTable;
