class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // A) Filtering
  filter() {
    // 1) Get the filter data from the URL
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };

    // 2) exclude these files from the filter
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let reqString = JSON.stringify(queryObj);
    // 3) Modify the string for special comparison operators
    reqString = JSON.parse(
      reqString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );
    // 4) Build the query
    this.query = this.query.find(reqString);
    return this;
  }

  // B) Sorting
  sort() {
    if (this.queryString.sort) {
      // Get sort value from the URL query
      const sortBy = this.queryString.sort.replaceAll(',', ' ');
      // add sort to query
      this.query = this.query.sort(sortBy);
    } else {
      // Sort by date of creation by default
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // C) Selecting fields
  limitFields() {
    if (this.queryString.fields) {
      // Get Selected fields from the URL query
      const selectedFields = this.queryString.fields.split(',').join(' ');
      // Add selected fields to the query
      this.query.select(selectedFields);
    } else this.query = this.query.select('-__v');
    return this;
  }

  // D) Pagination
  paginate() {
    // Get the limit if no limit is given the default is 5
    const limit = this.queryString.limit * 1 || 10;
    // Get the page from the URL query
    const page = this.queryString.page * 1 || 1;
    // calculate the amount of results to skip based on the page number
    const skip = (page - 1) * limit;

    // add the calculated number of results to skip to the query
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}
module.exports = APIFeatures;
