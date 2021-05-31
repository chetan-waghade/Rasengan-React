import React from 'react'


import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-kuroir";

import axios from 'axios'


function App() {

  const [language, setLanguage] = React.useState('java')
  const [theme, setTheme] = React.useState('monokai')
  const [loading, setLoading] = React.useState('button is-success')
  const [isC_CPP, setC_CPP] = React.useState('cpp')
  const [output, setOutput] = React.useState('')
  const [error, setError] = React.useState(false)



  // code submit
  const [script, setScript] = React.useState()
  const [stdin, setStdin] = React.useState()


  const handleLanguageSelection = (e) => {
    setLanguage(e.target.value);
  }

  const handleThemeSelection = (e) => {
    setTheme(e.target.value);
  }

  const handleRun = async (e) => {

    setLoading('button is-success is-loading')

    e.preventDefault()

    if (language === 'c_cpp') {
      setLanguage(isC_CPP)
    }

    const user = {
      script: script,
      language: language,
      stdin: stdin
    }


    await axios.post('http://localhost:3001/exec', { user: user })
      .then((result) => {

        if (result.data.statusCode === 417) {
          setError(true)
        }
        else if (result.data.statusCode === 200) {
          setError(false)
        }

        setOutput(result.data.output)
        setLoading('button is-success')


      })
      .catch((err) => console.log(err))

    // console.log("output :" + output);

  }


  function onChange(newValue) {
    setScript(newValue)
  }

  function handleInput(e) {
    console.log(e.target.value)
    setStdin(e.target.value)
  }


  return (
    <div className="App" >
      <div class="container is-fluid">
        <hr></hr>
        <h1 class="is-size-3 has-text-centered">Rasengan. Online Code Editor</h1>
        <hr></hr>

        <div class="columns mt-1">
          <div class="column is-one-fifth is-desktop">
            {/* Submission Panel */}
            <p> ⚙️ Option Panel</p>
            <div class="select mb-2">
              <select onChange={handleLanguageSelection}>
                <option value="">Select Language</option>
                <option value="java">Java</option>
                <option value="c_cpp">CPP</option>
                <option value="python3">Python 3</option>
              </select>
            </div>
            <div class="select mb-2">
              <select onChange={handleThemeSelection}>
                <option value="github">Github</option>
                <option value="monokai">Monokai</option>
                <option value="kuroir">Kuroir</option>
              </select>
            </div>
            <br />
            <button class={loading} onClick={handleRun}>Run</button>
            {/* <button class="button is-danger mb-2 mx-2" onClick={handleReset}>Reset</button> */}
          </div>

          <div class="column is-desktop" >
            <p>🖊️ Code Editor</p>
            {/* Editor */}
            <AceEditor
              mode={language}
              theme={theme}
              onChange={onChange}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
            />

          </div>
          <div class="column is-desktop">
            {/* Custom Input Area */}
            <p> 🔣 Input Panel  </p>
            <textarea class="textarea mt-1" placeholder="Enter your input.." onChange={handleInput}></textarea>
            <hr></hr>

            <div>
              {error ?

                <article class="message is-danger">
                  <div class="message-header">
                    <p>Error Panel</p>
                    <button class="delete" aria-label="delete"></button>
                  </div>
                  <div class="message-body">
                    {output}
                  </div>
                </article>
                :

                <article class="message is-success">
                  <div class="message-header">
                    <p>Output Panel</p>
                  </div>
                  <div class="message-body">
                    {output}
                  </div>
                </article>}


            </div>
          </div>

        </div>

      </div>

    </div >
  );
}

export default App;
