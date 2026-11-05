<template>
  <el-space wrap direction="horizontal" alignment="baseline" spacer=" ">
    <el-card class="box-card">
      <template #header>
        <div class="card-header"><span>Settings</span></div>
      </template>
      <el-form label-width="auto" label="right">
        <el-form-item label="Preset">
          <el-select v-model="selectedPreset" aria-label="QR code preset">
            <el-option
              v-for="preset in presets"
              :key="preset.id"
              :label="preset.label"
              :value="preset.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Data for QR">
          <el-tooltip
            effect="dark"
            content="You GitHub name or link to profile/repository"
            placement="top-start"
          >
            <el-input v-model="message" clearable />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Colors">
          <el-color-picker v-model="color" />
          <el-divider direction="vertical" />
          <el-color-picker v-model="backgroundColor" />
        </el-form-item>
        <el-form-item v-if="!isRasterLogo">
          <el-checkbox
            v-model="inverseLogoColor"
            label="Inverse logo colors"
            size="large"
            border
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="padding"
            label="Add padding"
            size="large"
            border
          />
        </el-form-item>
        <el-form-item label="Export size (px)">
          <el-input-number
            v-model="exportSize"
            :step="50"
            :min="100"
            :max="10000"
          />
        </el-form-item>
        <el-form-item label="Save as">
          <el-radio-group v-model="exportType" size="small">
            <el-radio-button label="SVG" />
            <el-radio-button label="PNG" />
            <el-radio-button label="JPG" />
            <el-radio-button label="WEBP" />
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="saveToFile"
          >
            Save
            <el-icon class="el-icon--right"><Download /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card
      class="box-card"
      body-style="background: repeating-linear-gradient(-45deg, #eee, #eee 10px, #ccc 10px, #ccc 20px);"
    >
      <template #header>
        <div class="card-header"><span>Preview</span></div>
      </template>
      <div v-loading="loading">
        <svg
          ref="svgcontainer"
          :width="size"
          :height="size"
          viewBox="0 0 350 350"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <svg v-html="preview" />
          <circle
            v-if="!isRasterLogo"
            :fill="logoBackgroundColor"
            stroke-width="6px"
            :stroke="logoColor"
            :cx="size / 2"
            :cy="size / 2"
            :r="(size * logoScale) / 2 + 8"
          />
          <rect
            v-if="isRasterLogo"
            :x="rasterLogoX - 6"
            :y="rasterLogoY - 6"
            :width="size * logoScale + 12"
            :height="size * logoScale + 12"
            rx="4"
            :fill="backgroundColor"
          />
          <image
            v-if="isRasterLogo"
            :x="rasterLogoX"
            :y="rasterLogoY"
            :width="size * logoScale"
            :height="size * logoScale"
            preserveAspectRatio="xMidYMid meet"
            :href="logoSource"
            :xlink:href="logoSource"
          />
          <svg
            v-else
            :x="size / 2 - (size * logoScale) / 2"
            :y="size / 2 - (size * logoScale) / 2"
            :width="size * logoScale"
            :height="size * logoScale"
            viewBox="0 0 24 24"
            :fill="logoColor"
          >
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </svg>
      </div>
    </el-card>
  </el-space>
</template>

<script>
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElColorPicker,
  ElDivider,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElLoading,
  ElMessage,
  ElOption,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElSpace,
  ElTooltip,
} from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { saveAs } from "file-saver";
import QRCode from "qrcode-svg";
import edropLogo from "./assets/presets/edrop_logo_upscaled.png";
import nowasteLogo from "./assets/presets/nowaste_logo.png";

const presets = [
  {
    id: "original",
    label: "Original",
    color: "#000",
    backgroundColor: "#fff",
    padding: false,
    paddingModules: 0,
    inverseLogoColor: false,
    logoScale: 0.33,
    ecl: "Q",
    logoSource: null,
  },
  {
    id: "edrop",
    label: "e-drop",
    color: "#1E6372",
    backgroundColor: "#FFFFFF",
    padding: true,
    paddingModules: 4,
    inverseLogoColor: false,
    logoScale: 0.22,
    ecl: "H",
    logoSource: edropLogo,
  },
  {
    id: "nowaste",
    label: "Nowaste",
    color: "#91B11B",
    backgroundColor: "#FFFFFF",
    padding: true,
    paddingModules: 4,
    inverseLogoColor: false,
    logoScale: 0.22,
    ecl: "H",
    logoSource: nowasteLogo,
  },
];

export default {
  name: "App",
  components: {
    ElButton,
    ElCard,
    ElCheckbox,
    ElColorPicker,
    ElDivider,
    ElForm,
    ElFormItem,
    ElIcon,
    ElInput,
    ElInputNumber,
    ElOption,
    ElRadioButton,
    ElRadioGroup,
    ElSelect,
    ElSpace,
    ElTooltip,
    Download,
  },
  directives: { loading: ElLoading.directive },
  data() {
    const originalPreset = presets[0];
    return {
      presets,
      selectedPreset: originalPreset.id,
      message: "luridev",
      size: 350,
      color: originalPreset.color,
      backgroundColor: originalPreset.backgroundColor,
      padding: originalPreset.padding,
      paddingModules: originalPreset.paddingModules,
      inverseLogoColor: originalPreset.inverseLogoColor,
      logoScale: originalPreset.logoScale,
      errorCorrectionLevel: originalPreset.ecl,
      exportType: "PNG",
      exportSize: 1200,
      loading: false,
      githubURL: "https://github.com",
    };
  },
  watch: {
    selectedPreset(presetId) {
      const preset = this.presets.find((item) => item.id === presetId);
      this.color = preset.color;
      this.backgroundColor = preset.backgroundColor;
      this.padding = preset.padding;
      this.paddingModules = preset.paddingModules;
      this.inverseLogoColor = preset.inverseLogoColor;
      this.logoScale = preset.logoScale;
      this.errorCorrectionLevel = preset.ecl;
    },
  },
  methods: {
    serializedSvg(exportSize) {
      const svg = this.$refs.svgcontainer.cloneNode(true);
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
      svg.setAttribute("viewBox", "0 0 350 350");
      svg.setAttribute("width", exportSize);
      svg.setAttribute("height", exportSize);
      return new XMLSerializer().serializeToString(svg);
    },
    canvasBlob(canvas, type) {
      return new Promise((resolve, reject) =>
        canvas.toBlob(
          (blob) =>
            blob
              ? resolve(blob)
              : reject(new Error("Could not create image file.")),
          type,
          1,
        ),
      );
    },
    async exportRaster(svg, exportSize, exportType, fileName) {
      const url = URL.createObjectURL(
        new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
      );
      try {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () =>
            reject(new Error("Could not render the QR code image."));
          img.src = url;
        });
        const canvas = document.createElement("canvas");
        canvas.width = exportSize;
        canvas.height = exportSize;
        canvas
          .getContext("2d")
          .drawImage(image, 0, 0, canvas.width, canvas.height);
        const type = {
          PNG: "image/png",
          JPG: "image/jpeg",
          WEBP: "image/webp",
        }[exportType];
        saveAs(
          await this.canvasBlob(canvas, type),
          `${fileName}.${exportType.toLowerCase()}`,
        );
      } finally {
        URL.revokeObjectURL(url);
      }
    },
    async saveToFile() {
      this.loading = true;
      const exportSize = this.exportSize;
      const exportType = this.exportType;
      const fileName = this.fileName;
      try {
        const svg = this.serializedSvg(exportSize);
        if (exportType === "SVG")
          saveAs(
            new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
            `${fileName}.svg`,
          );
        else await this.exportRaster(svg, exportSize, exportType, fileName);
      } catch (error) {
        ElMessage.error(error.message || "Could not save the QR code.");
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    activePreset() {
      return this.presets.find((preset) => preset.id === this.selectedPreset);
    },
    isRasterLogo() {
      return Boolean(this.activePreset.logoSource);
    },
    logoSource() {
      return this.activePreset.logoSource;
    },
    rasterLogoX() {
      return this.size / 2 - (this.size * this.logoScale) / 2;
    },
    rasterLogoY() {
      return this.size / 2 - (this.size * this.logoScale) / 2;
    },
    logoColor() {
      return this.inverseLogoColor ? this.backgroundColor : this.color;
    },
    logoBackgroundColor() {
      return this.inverseLogoColor ? this.color : this.backgroundColor;
    },
    fileName() {
      if (this.content.startsWith(this.githubURL)) {
        const startSubstring = this.githubURL.length + 1;
        const endSubstring = this.content.indexOf("/", startSubstring);
        const name = this.content.substring(
          startSubstring,
          endSubstring > 0 ? endSubstring : this.content.length,
        );
        return `QR-for-${name}`;
      }
      return "OR-code";
    },
    content() {
      if (this.message.startsWith("http")) return this.message;
      if (this.message.startsWith("/"))
        return `${this.githubURL}${this.message}`;
      return `${this.githubURL}/${this.message}`;
    },
    preview() {
      return new QRCode({
        content: this.content,
        padding: this.padding ? this.paddingModules : 0,
        width: this.size,
        height: this.size,
        color: this.color,
        background: this.backgroundColor,
        ecl: this.errorCorrectionLevel,
        xmlDeclaration: true,
        container: "none",
        join: true,
        pretty: false,
      }).svg();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
.card-header {
  text-align: left;
}
.box-card {
  max-width: 480px;
  margin: 0 auto;
}
.el-space .el-space__item {
  margin: 8px auto !important;
}
</style>
