<div align="center">

<img width="256" src="https://github.com/user-attachments/assets/6f9e4cf9-912d-4faa-9d37-54fb676f547e">

*Vibe your PPT like vibing code.*

**[中文](README.md) | English**

<p>

[![GitHub Stars](https://img.shields.io/github/stars/Anionex/banana-slides?style=square)](https://github.com/Anionex/banana-slides/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Anionex/banana-slides?style=square)](https://github.com/Anionex/banana-slides/network)
[![GitHub Watchers](https://img.shields.io/github/watchers/Anionex/banana-slides?style=square)](https://github.com/Anionex/banana-slides/watchers)

[![Version](https://img.shields.io/badge/version-v0.1.0-4CAF50.svg)](https://github.com/Anionex/banana-slides)
![Docker](https://img.shields.io/badge/Docker-Build-2496ED?logo=docker&logoColor=white)
[![GitHub issues](https://img.shields.io/github/issues-raw/Anionex/banana-slides)](https://github.com/Anionex/banana-slides/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/Anionex/banana-slides)](https://github.com/Anionex/banana-slides/pulls)


</p> 

<b>A native AI PPT generation application based on nano banana pro🍌. It supports generating complete PPT presentations from ideas, outlines, or page descriptions.<br></b>
<b> Automatically extract charts from attachments, upload any assets, and make modifications via natural language—moving towards a true "Vibe PPT" experience. </b>

<b>🎯 Lowering the barrier to PPT creation, allowing everyone to quickly produce beautiful and professional presentations.</b>

<br>

*If this project is helpful to you, please star🌟 & fork🍴*

<br>

</p>

</div>



## ✨ Project Origin
Have you ever been in this situation: a presentation is due tomorrow, but your slides are still blank? You have countless brilliant ideas in your head, but all your passion is drained by tedious layout and design work.

We long to create presentations that are both professional and aesthetic quickly. Traditional AI PPT generation apps, while satisfying the need for "speed," still face the following issues:

- 1️⃣ Limited to preset templates with no flexibility to adjust styles.
- 2️⃣ Low freedom, making multi-round modifications difficult.
- 3️⃣ Highly homogenized outputs that all look the same.
- 4️⃣ Low-quality assets that lack specific relevance.
- 5️⃣ Disjointed text and image layouts with poor design sense.

These flaws make it hard for traditional AI PPT generators to simultaneously meet the demands for both "speed" and "beauty." Even those claiming to be "Vibe PPT" are far from "Vibe" in my eyes.

However, the emergence of the nano banana🍌 model changed everything. I tried using 🍌pro to generate PPT pages and found that the quality, aesthetics, and consistency were excellent. It could accurately render almost all text required by the prompt and follow the style of reference images. So why not build a native "Vibe PPT" application based on 🍌pro?

## 👨‍💻 Use Cases

1. **Beginners**: Quickly generate beautiful PPTs with zero barrier to entry; no design experience needed, no more template fatigue.
2. **PPT Professionals**: Get design inspiration by referencing AI-generated layouts and text-image combinations.
3. **Educators**: Quickly convert teaching content into illustrated lesson plans to enhance classroom effectiveness.
4. **Students**: Finish assignment presentations rapidly, focusing effort on content rather than formatting.
5. **Business Professionals**: Quickly visualize business proposals and product introductions, adapting to multiple scenarios fast.


## 🎨 Case Studies


<div align="center">

| | |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/d58ce3f7-bcec-451d-a3b9-ca3c16223644" width="500" alt="Case 3"> | <img src="https://github.com/user-attachments/assets/c64cd952-2cdf-4a92-8c34-0322cbf3de4e" width="500" alt="Case 2"> |
| **Software Development Best Practices** | **DeepSeek-V3.2 Technical Showcase** |
| <img src="https://github.com/user-attachments/assets/383eb011-a167-4343-99eb-e1d0568830c7" width="500" alt="Case 4"> | <img src="https://github.com/user-attachments/assets/1a63afc9-ad05-4755-8480-fc4aa64987f1" width="500" alt="Case 1"> |
| **R&D and Industrialization of Smart Pre-cooked Food Equipment** | **The Evolution of Money: From Shells to Paper** |

</div>

See more at <a href="https://github.com/Anionex/banana-slides/issues/2" > Use Cases </a>


## 🎯 Features

### 1. Flexible Creative Paths
Supports **Idea**, **Outline**, and **Page Description** as three starting points to suit different creative habits.
- **One-sentence generation**: Enter a topic, and AI automatically generates a structured outline and page-by-page descriptions.
- **Natural language editing**: Supports "Vibe" style verbal modifications to the outline or descriptions (e.g., "Change page 3 to a case study"), with AI responding in real-time.
- **Outline/Description mode**: Choose between one-click batch generation or manual detail adjustment.

<img width="2000" height="1125" alt="image" src="https://github.com/user-attachments/assets/7fc1ecc6-433d-4157-b4ca-95fcebac66ba" />


### 2. Powerful Asset Parsing
- **Multi-format support**: Upload PDF/Docx/MD/Txt files for automatic background parsing.
- **Intelligent extraction**: Automatically identifies key points, image links, and chart info from text to provide rich assets for generation.
- **Style reference**: Support for uploading reference images or templates to customize the PPT style.

<img width="1920" height="1080" alt="File parsing and asset processing" src="https://github.com/user-attachments/assets/8cda1fd2-2369-4028-b310-ea6604183936" />

### 3. "Vibe" Style Natural Language Modification
No longer restricted by complex menus; issue modification commands directly via **natural language**.
- **Partial redraw**: Verbally modify unsatisfactory areas (e.g., "Replace this chart with a pie chart").
- **Page optimization**: Generate high-definition, stylistically consistent pages based on nano banana pro🍌.

<img width="2000" height="1125" alt="image" src="https://github.com/user-attachments/assets/929ba24a-996c-4f6d-9ec6-818be6b08ea3" />


### 4. Out-of-the-box Format Export
- **Multi-format support**: One-click export to standard **PPTX** or **PDF** files.
- **Perfect fit**: Default 16:9 aspect ratio, no secondary layout adjustment needed—ready for presentation.

<img width="1000" alt="image" src="https://github.com/user-attachments/assets/3e54bbba-88be-4f69-90a1-02e875c25420" />
<img width="1748" height="538" alt="PPT and PDF Export" src="https://github.com/user-attachments/assets/647eb9b1-d0b6-42cb-a898-378ebe06c984" />

### 5. Editable Component PPTX Export (Beta Iteration)
- **Intelligent recursive analysis for component extraction, text extraction, and table extraction to obtain manually editable PPTX files.**
<img width="1000"  alt="image" src="https://github.com/user-attachments/assets/a85d2d48-1966-4800-a4bf-73d17f914062" />

<br>

**🌟 Comparison with NotebookLM Slide Deck Feature**
| Feature | NotebookLM | This Project | 
| --- | --- | --- |
| Max Pages | 15 pages | **Unlimited** | 
| Editing | Not supported | **Box-select editing + Natural language editing** |
| Adding Assets | Cannot add after generation | **Freely add after generation** |
| Export Formats | PDF only | **PDF, (Editable) PPTX** |
| Watermark | Watermarked in free version | **No watermark, free element manipulation** |

> Note: Comparison may become outdated as new features are added.



## 🔥 Recent Updates
- 【Jan-03】: Comprehensive upgrade for editable PPTX export:
  1. Maximized restoration of font size, color, bolding, etc., from image text;
  2. Support for recognizing text content in tables;
  3. More precise logic for text size and position restoration;
  4. Optimized export workflow, significantly reducing residual text on background images after export.
- Support for multi-page selection logic, allowing flexible selection of specific pages to generate and export.

- 【Dec-27】: Added support for image-free template mode and high-quality text presets. Now PPT page styles can be controlled via pure text descriptions.
- 【Dec-24】: Main branch added an editable PPTX export method based on nano-banana-pro background extraction (currently Beta).


## 🗺️ Roadmap

| Status | Milestone |
| --- | --- |
| ✅ Done | Create PPT from ideas, outlines, or page descriptions |
| ✅ Done | Parse Markdown format images from text |
| ✅ Done | Add more assets to single PPT pages |
| ✅ Done | Box-select Vibe natural language editing for single pages |
| ✅ Done | Asset Module: Asset generation, upload, etc. |
| ✅ Done | Support for uploading and parsing multiple file types |
| ✅ Done | Support for Vibe natural language adjustment of outlines and descriptions |
| ✅ Done | Preliminary support for editable PPTX file export |
| 🔄 In Progress | Support for multi-layer, precise background removal editable PPTX export |
| 🔄 In Progress | Web search capability |
| 🔄 In Progress | Agent Mode |
| 🧭 Planned | Optimize frontend loading speed |
| 🧭 Planned | Online playback feature |
| 🧭 Planned | Simple animations and page transition effects |
| 🧭 Planned | Multi-language support |
| 🧭 Planned | User system |

## 📦 How to Use

### Using Docker Compose🐳 (Recommended)
This is the easiest deployment method, starting both frontend and backend services with one command.

<details>
  <summary>📒 Instructions for Windows Users</summary>

If you are using Windows, please install Docker Desktop for Windows first. Check the Docker icon in the system tray to ensure Docker is running, then follow the same steps.

> **Tip**: If you encounter issues, ensure WSL 2 backend is enabled in Docker Desktop settings (recommended) and that ports 3000 and 5000 are not occupied.

</details>

0. **Clone the repository**
```bash
git clone https://github.com/Anionex/banana-slides
cd banana-slides
```

1. **Configure Environment Variables**

Create a `.env` file (refer to `.env.example`):
```bash
cp .env.example .env
```

Edit the `.env` file and configure the necessary variables:
> **The project uses the AIHubMix platform format as the standard for LLM interfaces. It is recommended to use [AIHubMix](https://aihubmix.com/?aff=17EC) to get an API key and reduce migration costs.**  
```env
# AI Provider format (gemini / openai / vertex)
AI_PROVIDER_FORMAT=gemini

# Gemini configuration (used when AI_PROVIDER_FORMAT=gemini)
GOOGLE_API_KEY=your-api-key-here
GOOGLE_API_BASE=https://generativelanguage.googleapis.com
# Proxy example: https://aihubmix.com/gemini

# OpenAI configuration (used when AI_PROVIDER_FORMAT=openai)
OPENAI_API_KEY=your-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1
# Proxy example: https://aihubmix.com/v1

# Vertex AI configuration (used when AI_PROVIDER_FORMAT=vertex)
# Requires GCP service account, can use GCP free tier
# VERTEX_PROJECT_ID=your-gcp-project-id
# VERTEX_LOCATION=global
# GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account.json
...
```

**Configuration for the new editable export**: Create an application on the [Baidu AI Cloud Platform](https://console.bce.baidu.com/ai-engine/ocr/overview/index?type=1) to get an API KEY, then fill it in the `BAIDU_OCR_API_KEY` field in the `.env` file (it has a generous free tier).


<details>
  <summary>📒 Using Vertex AI (GCP Free Tier)</summary>

If you want to use Google Cloud Vertex AI (available via GCP new user credits), additional configuration is needed:

1. Create a service account in the [GCP Console](https://console.cloud.google.com/) and download the JSON key file.
2. Rename the key file to `gcp-service-account.json` and place it in the project root.
3. Edit the `.env` file:
   ```env
   AI_PROVIDER_FORMAT=vertex
   VERTEX_PROJECT_ID=your-gcp-project-id
   VERTEX_LOCATION=global
   ```
4. Edit `docker-compose.yml` and uncomment the following:
   ```yaml
   # environment:
   #   - GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-service-account.json
   # ...
   # - ./gcp-service-account.json:/app/gcp-service-account.json:ro
   ```

> **Note**: `gemini-3-*` series models require `VERTEX_LOCATION=global`.

</details>

2. **Start the Services**

```bash
docker compose up -d
```

> [!TIP]
> If you encounter network issues, you can uncomment the mirror source configurations in the `.env` file and rerun the start command:
> ```env
> # Uncomment the following in the .env file to use mirrors in China
> DOCKER_REGISTRY=docker.1ms.run/
> GHCR_REGISTRY=ghcr.nju.edu.cn/
> APT_MIRROR=mirrors.aliyun.com
> PYPI_INDEX_URL=https://mirrors.cloud.tencent.com/pypi/simple
> NPM_REGISTRY=https://registry.npmmirror.com/
> ```


3. **Access the Application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

4. **View Logs**

```bash
# View backend logs (real-time, last 50 lines)
sudo docker compose logs -f --tail 50 backend

# View all service logs
sudo docker compose logs -f --tail 50

# View frontend logs
sudo docker compose logs -f --tail 50 frontend
```

5. **Stop the Services**

```bash
docker compose down
```

6. **Update the Project**

Pull the latest code, rebuild, and restart the services:

```bash
git pull
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Deploying from Source

#### Requirements
- Python 3.10 or higher
- [uv](https://github.com/astral-sh/uv) - Python package manager
- Node.js 16+ and npm
- Valid Google Gemini API Key

#### Backend Installation

0. **Clone the repository**
```bash
git clone https://github.com/Anionex/banana-slides
cd banana-slides
```

1. **Install uv (if not already installed)**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. **Install Dependencies**

Run in the project root:
```bash
uv sync
```

This will automatically install all dependencies based on `pyproject.toml`.

3. **Configure Environment Variables**

Copy the template:
```bash
cp .env.example .env
```

Edit `.env` and configure your API key:
> **The project uses the AIHubMix platform format as the standard. It is recommended to use [AIHubMix](https://aihubmix.com/?aff=17EC) for API keys.** 
```env
# AI Provider format (gemini / openai / vertex)
AI_PROVIDER_FORMAT=gemini

# Gemini configuration
GOOGLE_API_KEY=your-api-key-here
GOOGLE_API_BASE=https://generativelanguage.googleapis.com

# OpenAI configuration
OPENAI_API_KEY=your-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1

# Vertex AI configuration
# ...

PORT=5000
...
```

#### Frontend Installation

1. **Enter the frontend directory**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure API Address**

The frontend connects to the backend at `http://localhost:5000` by default. To change this, edit `src/api/client.ts`.


#### Start Backend Service
> (Optional) If you have important local data, it's recommended to back up the database before upgrading:  
> `cp backend/instance/database.db backend/instance/database.db.bak`

```bash
cd backend
uv run alembic upgrade head && uv run python app.py
```

The backend service will start at `http://localhost:5000`.

Visit `http://localhost:5000/health` to verify the service is running.

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend development server will start at `http://localhost:3000`.

Open your browser to start using the app.


## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Components**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Language**: Python 3.10+
- **Framework**: Flask 3.0
- **Package Management**: uv
- **Database**: SQLite + Flask-SQLAlchemy
- **AI Engine**: Google Gemini API
- **PPT Processing**: python-pptx
- **Image Processing**: Pillow
- **Concurrency**: ThreadPoolExecutor
- **CORS Support**: Flask-CORS

## 📁 Project Structure

```
banana-slides/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Homepage (Create project)
│   │   │   ├── OutlineEditor.tsx    # Outline editor
│   │   │   ├── DetailEditor.tsx     # Detailed description editor
│   │   │   ├── SlidePreview.tsx     # Slide preview page
│   │   │   └── History.tsx          # History version management
│   │   ├── components/         # UI components
│   │   │   ├── outline/        # Outline components
│   │   │   ├── preview/        # Preview components
│   │   │   ├── shared/         # Shared components
│   │   │   ├── layout/         # Layout components
│   │   │   └── history/        # History components
│   │   ├── store/              # Zustand state management
│   │   ├── api/                # API endpoints
│   │   ├── types/              # TypeScript definitions
│   │   ├── utils/              # Utility functions
│   │   ├── constants/          # Constants
│   │   └── styles/             # Styles
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                    # Flask backend application
│   ├── app.py                  # Entry point
│   ├── config.py               # Configuration
│   ├── models/                 # Database models
│   ├── services/               # Service layer (AI, File, Export, etc.)
│   ├── controllers/            # API controllers
│   ├── utils/                  # Utilities
│   ├── instance/               # SQLite DB (Auto-generated)
│   ├── exports/                # Exported files directory
│   ├── Dockerfile
│   └── README.md
│
├── tests/                      # Testing files
├── v0_demo/                    # Early demo version
├── output/                     # Output directory
│
├── pyproject.toml              # Python project config
├── uv.lock                     # uv lockfile
├── docker-compose.yml          # Docker Compose config
├── .env.example                 # Env template
├── LICENSE                     # License
└── README.md                   # This file
```

## Communication Group
To facilitate communication and mutual aid, we have established this WeChat group.

Feel free to suggest new features or give feedback. I will answer questions when available.

<img width="301" alt="image" src="https://github.com/user-attachments/assets/57e6bae0-b127-4e01-8ccf-5669522b0162" />



**FAQ**
1.  **Does it support the free tier Gemini API Key?**
    *   The free tier only supports text generation, not image generation.
2.  **503 Error or Retry Error during generation**
    *   Check the Docker internal logs using the commands in the README to locate the specific error. Usually, this is caused by incorrect model configuration.
3.  **Why doesn't the API Key in .env take effect?**
    1.  Editing `.env` while running requires restarting the Docker container to apply changes.
    2.  If you set parameters in the web settings page, they will override `.env`. Use "Restore Defaults" to revert to `.env` values.
4.  **Garbled text in generated pages**
    *   Try higher resolution output (OpenAI format might not support this).
    *   Ensure the page description includes the specific text content to be rendered.
  

## 🤝 Contributing

Contributions via
[Issue](https://github.com/Anionex/banana-slides/issues)
and
[Pull Request](https://github.com/Anionex/banana-slides/pulls)
are highly welcome!

## 📄 License

This project is open-sourced under the CC BY-NC-SA 4.0 license.

It is free for non-commercial use such as personal study, research, testing, education, or non-profit scientific activities.

<details> 

<summary> Details </summary>
The license for this project is non-commercial (CC BY-NC-SA).  
Any commercial use requires a commercial license.

**Commercial use** includes but is not limited to:

1. Internal use by companies or institutions;
2. Providing external services;
3. Other for-profit purposes.

**Examples of non-commercial use** (No license required):

- Personal study, research, testing, education, or non-profit scientific activities;
- Open-source community contributions, personal portfolio displays, and other uses that do not generate economic revenue.

> Note: If you have questions about your use case, please contact the author for authorization.

</details>



<h2>🚀 Sponsor </h2>

<div align="center">
<a href="https://aihubmix.com/?aff=17EC">
  <img src="./assets/logo_aihubmix.png" alt="AIHubMix" style="height:48px;">
</a>
<p>Thanks to AIHubMix for sponsoring this project</p>
</div>

## Acknowledgments

- Contributors:

[![Contributors](https://contrib.rocks/image?repo=Anionex/banana-slides)](https://github.com/Anionex/banana-slides/graphs/contributors)

- [Linux.do](https://linux.do/): The ideal new community.
  
## Donation

Open source is not easy 🙏 If this project is valuable to you, feel free to buy the developer a coffee ☕️

<img width="240" alt="image" src="https://github.com/user-attachments/assets/fd7a286d-711b-445e-aecf-43e3fe356473" />

Thanks to the following friends for their voluntary sponsorship:
> @雅俗共赏, @曹峥, @以年观日, @John, @azazo1, @刘聪NLP, @🍟, @苍何, @biubiu  
> If you have questions about the sponsorship list (e.g., your name is missing), please <a href="mailto:anionex@qq.com">contact the author</a>.
 
## 📈 Project Stats

<a href="https://www.star-history.com/#Anionex/banana-slides&type=Timeline&legend=top-left">

 <picture>

   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Anionex/banana-slides&type=Timeline&theme=dark&legend=top-left" />

   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Anionex/banana-slides&type=Timeline&legend=top-left" />

   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Anionex/banana-slides&type=Timeline&legend=top-left" />

 </picture>

</a>

<br>