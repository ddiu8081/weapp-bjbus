const Utils = {};

Utils.base64_decode = function (input) { // 解码，配合decodeURIComponent使用
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++));
    enc2 = base64EncodeChars.indexOf(input.charAt(i++));
    enc3 = base64EncodeChars.indexOf(input.charAt(i++));
    enc4 = base64EncodeChars.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  return utf8_decode(output);
}

Utils.rc4 = function (data, key) {
  var seq = Array(256); //int
  var das = Array(data.length); //code of data
  for (var i = 0; i < 256; i++) {
    seq[i] = i;
    var j = (j + seq[i] + key.charCodeAt(i % key.length)) % 256;
    var temp = seq[i];
    seq[i] = seq[j];
    seq[j] = temp;
  }
  for (var i = 0; i < data.length; i++) {
    das[i] = data.charCodeAt(i)
  }
  for (var x = 0; x < das.length; x++) {
    var i = (i + 1) % 256;
    var j = (j + seq[i]) % 256;
    var temp = seq[i];
    seq[i] = seq[j];
    seq[j] = temp;
    var k = (seq[i] + (seq[j] % 256)) % 256;
    das[x] = String.fromCharCode(das[x] ^ seq[k]);
  }
  return das.join('');
}

Utils.UnicodeToUtf8 = function (unicode) {
  var uchar;
  var utf8str = "";
  var i;

  for (i = 0; i < unicode.length; i += 2) {
    uchar = (unicode[i] << 8) | unicode[i + 1];				//UNICODE为2字节编码，一次读入2个字节
    utf8str = utf8str + String.fromCharCode(uchar);	//使用String.fromCharCode强制转换
  }
  return utf8str;
}

Utils.Utf8ToUnicode = function (strUtf8) {
  var i, j;
  var uCode;
  var temp = new Array();

  for (i = 0, j = 0; i < strUtf8.length; i++) {
    uCode = strUtf8.charCodeAt(i);
    if (uCode < 0x100) {					//ASCII字符
      temp[j++] = 0x00;
      temp[j++] = uCode;
    } else if (uCode < 0x10000) {
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else if (uCode < 0x1000000) {
      temp[j++] = (uCode >> 16) & 0xff;
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else if (uCode < 0x100000000) {
      temp[j++] = (uCode >> 24) & 0xff;
      temp[j++] = (uCode >> 16) & 0xff;
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else {
      break;
    }
  }
  temp.length = j;
  return temp;
}

function utf8_decode(utftext) { // utf-8解码
  var string = '';
  let i = 0;
  let c = 0;
  let c1 = 0;
  let c2 = 0;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c1 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      i += 2;
    } else {
      c1 = utftext.charCodeAt(i + 1);
      c2 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
      i += 3;
    }
  }
  return string;
}

module.exports = Utils;
