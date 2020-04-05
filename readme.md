<div align="center">
    <img src="./docs/zippie-01.png" alt="zippie illustration" height="300">
    <h1>🚠️ zipline 🚠️</h1>
</div>

![travis-ci](https://travis-ci.com/raa-tools/zipline.svg?branch=master)

`zipline` is a microservice to zip and download files from GitHub.

Downloaded & zipped files retain the folder structure of the source. Any request error will be logged in the file.

For example, if we were to try downloading `checkImages/checkImages.js` and `updateImages/updateImages.js`, and *the second file doesn't exist* (`404` error):
```
download.zip
 |
 |_ checkImages
 |   |
 |   |_ checkImages.js
 |
 |_ updateImages
     |
     |_ updateImages.js // File content: Error 404 downloading from source
```

## API
This service only supports **`GET`**, has one primary endpoint (**`/api/get`**), and uses a query string to search and fetch files.
```
https://raa-zipline.herokuapp.com/api/get?querystringhere
```

`zipline` also provides an endpoing to `ping` and wake up the service: `/api/ping`. That end point will return a `204` (no content).

### Query String
To use, simply pass in the target **`user`**, **`repo`**, and **`file`** as parameters of the query string.

**Note:** Remember to escape forward slashes (as `%2F`) and spaces (`%20`).

For example, to download `checkImages/checkImages.jsx` from `raa-tools`'s `indd` repo:
```
/api/get?user=raa-tools&repo=indd&file=checkImages%2FcheckImages.jsx
```

### File ID
By default, the generated `.zip` file is timestamped on creation to create a unique file name for the client. `zipline` uses UTC in the format `yyyymmddhhmmss`. However, it's possible for the client to pass in an arbitrary `id` query parameter to override the feature.

For example, the following query:
```
/api/get?user=raa-tools&repo=indd&file=checkImages%2FcheckImages.jsx&id=12345
```
will return `download-12345.zip`.

### Downloading Multiple Files
When downloading multiple files, every file's `user` and `repo` must be specified:
```
/api/get?user=raa-tools&repo=indd&file=checkImages%2FcheckImages.jsx&user=raa-tools&repo=indd&file=batchConvert%2FbatchConvert.jsxbin
```

### Specifying Branches
By default, `zipline` will download from the `master` branch. To specify a different branch, simply pass it as part of the query string.

**Note:** When downloading multiple files, if the branch for one file is specified, the branch for all other files must be specified.

```
/api/get?user=raa-tools&repo=indd&branch=master&file=checkImages%2FcheckImages.jsx&user=raa-tools&repo=indd&branch=dev&file=batchConvert%2FbatchConvert.jsxbin
```

