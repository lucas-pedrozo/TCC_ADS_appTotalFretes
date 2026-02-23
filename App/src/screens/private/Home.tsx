import {Text, View} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function Home() {
  return(
    <SafeAreaView className="flex-1 justify-center items-center px-5">
      <Text className='text-lightText dark:text-darkText text-2xl font-bold text-center'>Home Screen</Text>
    </SafeAreaView>
  ); 
}

export default Home;