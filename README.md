# RAID - Real-Time Animal Identification & Deterrence
![raid-gh-readme](https://user-images.githubusercontent.com/47800618/219179484-fd456f2d-5907-409c-b5f0-57f714221be6.png)



<details>

  <summary>FYP Instructions</summary>

  [![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=8884991&assignment_repo_type=AssignmentRepo)
  ## project_y4 repo

  this is a blank starter repository for the DL836 y4 project.

  Please note:

  You have to submit your code using Github classroom.
  You are expected to submit regularly during each sprint.
  You should track issues and errors and describe these changes in your implementaiton chapters.
  Use branches to distinguish between different stages. 

  Please note:

  * NO files larger than 100 MB can be committed using Github
  * If you wish to use larger files that this investigate the large file storage (LFS) option.
  * Include an appropriate .gitignore file for your source code. 


  ## Source Code
  Upload your source the code for your project to the "Source" folder

  ## Report
  Upload your report to the "Docs" folder as a .pdf. You also have to submit this as a TurnItin document.

  ## Screencast
  Create a walkthrough of your project with a voice-over. Upload a .mp4 file to video. 
</details>


# Abstract:
```
The aim of this project was to create a novel system capable of leveraging computer vision technology not only to identify animals by species, but of distinguishing one individual from another of the same species based on pet images uploaded by the user, and to be capable of doing this in real-time via a live camera feed. With this achieved, the project was also intended to act as a deterrent for wild animals or stray pets by running a two-stage object detection system in which the first stage detects an animal's species, and the second determines whether the animal is the user's pet, or not. 
```

# Running this Project:

Clone the project:
```
git clone https://github.com/IADT-projects/y4-project-jakewarrenblack
```

Initialise and update submodule (the middleman server)
```
cd your_directory/y4-project-jakewarrenblack

git submodule init

git submodule update --remote
```

Install all packages:
```
cd frontend && npm i

cd ../raid-middleman-server && npm i

cd ../rpi_server && npm i
```

Separately, build OpenCV. If on windows, run this command in an admin PowerShell window. If on Linux, run it using `sudo`.
```
cd raid-middleman-server

npx build-opencv --rebuild
```

Same again, for the Raspberry Pi:

```
cd rpi-server

npx build-opencv --rebuild
```

*Important note:*
The upload page depends on the React-Dropzone-Uploader package, which in turn is a wrapper around React-Dropzone itself. React-Dropzone-Uploader is using an old version of React-Dropzone from before the following bug was fixed:

https://github.com/react-dropzone/react-dropzone/issues/554

As a result, in `Upload.jsx`, the Dropzone component is used as `Dropzone.default` - if you want to run the development server, you have to remove the `.default` extension! This is necessary for production only, it will break the development server.

You will notice the commands for running the Raspberry Pi server and the middleman server are prefixed with `doppler run`. I'm using Doppler, a secrets management service. If you want to use Doppler too, follow the instructions here:

https://docs.doppler.com/docs/install-cli

And leave the command as is.

Otherwise, remove the `doppler run --` prefix and create a local `.env` file containing your secrets.

Finally, note the 'onoff' module used by the rpi-server can (obviously) only be used by a Raspberry Pi (or something else which has GPIO pins), so don't expect the buzzer to work unless you're running the rpi-server on a Raspberry Pi with a Piezo buzzer connected to it :)

---

## Technologies:

### Client:
- React
- TailwindCSS
- Vite
- React-BBox-Annotator (Custom implementation)
- PassportJS w/ local, JWT, and Google OAuth 2.0 authentication

## 'Middleman' server:
- NodeJS
- Express
- SocketIO
- HiveMQ/MQTT.js
- Custom implementation of Roboflow utility functions and REST endpoints

# Raspberry Pi
- GPIO
- YOLOv4-Tiny
- OpenCV4NodeJS
- HiveMQ/MQTT.js

## Figma links:

App architecture: `https://www.figma.com/file/SRXstoyZy8ssoUtGAjdHCB/RAID---app-architecture?type=whiteboard&t=XuZRnnQwRujPCC9f-6`

Prototype: `https://www.figma.com/file/oPHnUHd1nGTQMEaTZfGg28/RAID?type=design&t=XuZRnnQwRujPCC9f-6`
