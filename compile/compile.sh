cd /Users/akurniawan/Sites/web/akurniawan.github.io/CodeEditor/compile/$3
if [ $2 = "cpp" ];
then
	echo "running ./$1\n"
	g++ $1.cpp -O2 -o $1
	compileResult=$?
elif [ $2 = "java" ];
then
	echo "running java $1\n"
	javac $1.java
	compileResult=$?
fi

if [ $compileResult = 0 ] && [ $2 = "cpp" ];
then
	./$1
elif [ $compileResult = 0 ] && [ $2 = "java" ];
then
	java $1
  rm $1.class
fi

echo "\nProgram has successfully terminated!"
rm $1.$2
