var fs = require('fs');

// utils
const getValidFolders = () => {
  let folders = fs.readdirSync('./');
  // filter folder like 'client-xxxx'
  folders = folders.filter((folder) => {
    return folder.indexOf('client-') === 0;
  });

  return folders;
};

const getValidFiles = (path, files) => {
  // filter on extension
  files = files.filter((file) => {
    return file.indexOf('.scss') > -1;
  });
  // filter on if correct import shows
  files = files.filter((file) => {
    const content = fs.readFileSync(`${path}/${file}`);
    return content.indexOf("@import '~variables/colors.scss';") > -1;
  });
  return files;
};

// var contents = fs.readFileSync('./index.py', 'utf8');

// process spreadsheet to dictionary
const example = {
  '$color-light-blue': {
    name: 'dark-blue',
    color: '#190909',
  },
  '$color-light-green': {
    name: 'grass-mint',
    color: '#232324',
  },
};

// Read mapping file or variable
const colorMaps = example;
const colors = Object.keys(colorMaps);

// Replace old color with new one
// Loop all valid scss file in valid folder
// folder should something like 'client-xx'
// valid scss should be the one contains import statement from variable/colors.scss from client-common
getValidFolders().forEach((dir) => {
  // console.log('top level directory ->', dir);
  const basePath = `${dir}/assets`;
  let assetsDir;
  try {
    assetsDir = fs.readdirSync(basePath);
  } catch (error) {
    console.log(`Current directory ${dir} has no assets folder \n`);
    return;
  }

  const files = getValidFiles(basePath, assetsDir);
  files.forEach((file) => {
    console.log('valid file->', file);
    const filePath = `${basePath}/${file}`;
    fs.readFile(filePath, 'utf-8', function (err, data) {
      if (err) throw err;

      // loop values in colorMaps
      colors.forEach((color) => {
        const regex = new RegExp('\\' + color + '\\b', 'gi');
        const newName = `$color-${colorMaps[color].name}`;
        data = data.replace(regex, newName);
        console.log('');
      });

      // todo also replace color

      fs.writeFile(filePath, data, 'utf-8', function (err) {
        if (err) throw err;
        console.log('Done!');
      });
    });
  });
});
