const BASE_URL = 'https://XXX.XXX.XXX/'
const CryptoJS = require('crypto-js'); 
//传入的用于加密的秘钥
let xkey = CryptoJS.enc.Utf8.parse('XXXXXXX')
//传入的用于加密的秘钥偏移量
let xiv = CryptoJS.enc.Utf8.parse('XXXXXXX')
export const dataEncryptPublic = (args)=>{
	let srcs = '';
	let encrypted = '';
	let decryptedData = '';
	srcs = CryptoJS.enc.Utf8.parse(args);
	encrypted = CryptoJS.AES.encrypt(srcs, xkey, { iv: xiv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
	decryptedData = encrypted.ciphertext.toString()
	return decryptedData
};
export const dataDecryptPublic = (args)=>{
	let encryptedHexStr = CryptoJS.enc.Hex.parse(args);
	let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
	let decrypt = CryptoJS.AES.decrypt(srcs, xkey, { iv: xiv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
	let decryptedData = decrypt.toString(CryptoJS.enc.Utf8);
	return decryptedData
};
export const dataSha1 = (args)=>{
	return CryptoJS.SHA1(args).toString();
};
export const userAgentCheck = (navigator)=>{
	if(!!navigator){
		if(navigator.userAgent.indexOf('Mobile')>-1){
			return false
		}
		if(navigator.userAgent.indexOf('Windows')>-1){
			return true
		}
		if(navigator.userAgent.indexOf('Macintosh')>-1){
			return true
		}
	}else{
		return false
	}
};
export const comRequest = (OPtions)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:BASE_URL+'api/'+OPtions.url,
			method:OPtions.Method || 'GET',
			data:OPtions.data || {},
			header:OPtions.header || {},
			success: (res) => {
				if(res.statusCode == 429){
					return uni.showToast({
						title:'1分钟后重新输入'
					})
					console.log('手速太快了！请1分钟后再试',res)
				}
				else if(res.statusCode !== 429 && res.statusCode !== 200){
					console.log('数据获取失败',res)
				}
				resolve(res)		
			},
			fail: (err) => {
				console.log('请求接口失败',err)
				reject(err)
			}
		})
	})
};

export const pureRequest = (OPtions)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:BASE_URL+OPtions.url,
			method:OPtions.Method || 'GET',
			data:OPtions.data || {},
			header:OPtions.header || {},
			success: (res) => {
				if(res.statusCode == 429){
					return uni.showToast({
						title:'1分钟后重新输入'
					})
					console.log('手速太快了！请1分钟后再试',res)
				}
				else if(res.statusCode !== 429 && res.statusCode !== 200){
					console.log('数据获取失败',res)
				}
				resolve(res)		
			},
			fail: (err) => {
				console.log('请求接口失败',err)
				reject(err)
			}
		})
	})
};

export const graphqlRequest = (OPtions)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:BASE_URL+OPtions.url,
			method:OPtions.Method || 'POST',
			data: {
			    query: OPtions.query || {},
			},			
			header:OPtions.header || {},
			success: (res) => {
				if(res.statusCode == 429){
					return uni.showToast({
						title:'1分钟后重新输入'
					})
					console.log('手速太快了！请1分钟后再试',res)
				}
				else if(res.statusCode == 401){
					return uni.navigateTo({
						url:"/pages/signin/signin"
					})
					 uni.showToast({
						title:'请重新登录'
					})
					console.log('登录失效',res)
				}
				resolve(res)		
			},
			fail: (err) => {
				console.log('请求接口失败',err)
				reject(err)
			}
		})
	})
};