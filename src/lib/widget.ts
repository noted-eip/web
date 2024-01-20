import axios from 'axios'

export const getWikipediaImageNameFromUrl = (imageUrl: string) => {
  let imgName = ''
  if (imageUrl != undefined) {
    const subStringFirst = imageUrl.substring(
      imageUrl.indexOf(':') + 1,
      imageUrl.length)
    imgName = subStringFirst.substring(
      subStringFirst.indexOf(':') + 1,
      subStringFirst.length)
  }
  return imgName
}
  
export const getWikipediaImage = async(imgName: string) => {
  let imgUrl ='' 
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await axios.get<any>(
      'https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles=File:' + imgName + '&continue=&format=json&origin=*',
    )
    if (data != null &&  data['query']['pages']['-1'] !== undefined && data['query']['pages']['-1']['imageinfo'] !== undefined) {
      imgUrl = data['query']['pages']['-1']['imageinfo'][0]['url']
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.message
    } else {
      return 'An unexpected error occurred'
    }
  }
  return imgUrl
}
