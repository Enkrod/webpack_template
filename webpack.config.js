const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompassImageHelperPlugin = require('webpack-compass-imagehelper');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const globImporter = require('node-sass-glob-importer');
const LicensePlugin = require('webpack-license-plugin')

module.exports = (env) => {

    const environment = (env.production) ? 'production' : 'development';
    const debug = (env.development === true);

    return {
        experiments: {
            topLevelAwait: true,
        },

        resolve: {
            modules: [
                path.resolve(__dirname, 'src'),
                "node_modules"
            ],
        },

        mode: environment,
        entry: {
            /*"theme": 'js/index.js',
            "contentonly": 'js/contentonly.js',
            "preview": 'js/preview.js',
            "ckeditor": 'js/ckeditor.js',*/
            test: "index.js"
        },
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, './dist/'),
            clean: true,
            assetModuleFilename: 'assets/[name][ext][query]',
            chunkFilename: 'js/[id].[contenthash].js',
        },
        devtool: debug ? 'inline-source-map' : false,
        devServer: {
            static: {
                directory: path.join(__dirname, 'public'),
            },
            compress: true,
            port: 9000,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        'babel-loader',
                        'glob-import-loader'
                    ]
                },
                {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: debug,
                                importLoaders: 1,
                                modules: {
                                    mode: "global",
                                    exportGlobals: true
                                }
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: debug,
                                postcssOptions: {
                                    plugins: [
                                        require('autoprefixer'),
                                        require('postcss-combine-media-query'),
                                    ]
                                },

                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: debug,
                                sassOptions: {
                                    importer: globImporter()
                                }
                            },
                        },
                        /*{
                            loader: 'sass-resources-loader',
                            options: {
                                resources: require(path.join(process.cwd(), "src/module-imports.js")),
                                hoistUseStatements: true
                            }
                        }*/
                    ],
                },
                {
                    test: /fonts.+\.(woff2|woff|eot|ttf|otf|svg).*$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name].[contenthash][ext][query]'
                    }
                },
                {
                    test: /images.+\.(jpg|jpeg|png|gif|webp).*$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[contenthash][ext][query]'
                    }
                },
                {
                    test: /fontawesome.+\.svg.*$/i,
                    type: 'asset/inline', // only inline or resource
                    /*generator: {
                        filename: 'images/[name].[contenthash][ext][query]'
                    }*/
                },
                {
                    test: /images.+\.svg.*$/i,
                    type: 'asset/inline', // only inline or resource
                    /*generator: {
                        filename: 'images/[name].[contenthash][ext][query]'
                    }*/
                }
            ]
        },
        plugins: [
            /*// new LicensePlugin(),
            new CopyPlugin({
                patterns: [
                    { from: "./src/images/kein-bild*", to: "images/[name][ext]" },
                    { from: "./src/js/vendor/ext-*", to: "js/vendor/[name][ext]" },
                ],
            }),
            // Correct implementation for usage in ./src/scss
            new CompassImageHelperPlugin({
                targetFile: './src/scss/utils/images/_images.scss',
                images_path: './src/images/',
                pattern: './!**!/!*',
                css_path: './src/scss/',
                sizeLimit: 1, // size limit for image embedding
            }),

            // Hacky implementation for usage in js-components
            new CompassImageHelperPlugin({
                targetFile: './src/scss/utils/images/_module-images.scss',
                images_path: './src/images/',
                pattern: './!**!/!*',
                css_path: './src/js/components/component_name/',
                sizeLimit: 1, // size limit for image embedding
            }),
            /!*new HtmlWebpackPlugin({
                filename: 'home.html',
                scriptLoading: "module",
                inject: true,
                chunks: ['homeStyleGuide', 'themeStyleGuide']
            }),
            new HtmlWebpackPlugin({
                filename: 'detail.html',
                scriptLoading: "module",
                inject: true,
                chunks: ['detailStyleGuide', 'themeStyleGuide']
            }),*!/
            new ResourceHintWebpackPlugin(),*/
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
                chunkFilename: 'css/[id].[contenthash].css'
            }),
            new StylelintPlugin()
        ],
        optimization: {
            minimizer: [
                // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
                `...`,
                new CssMinimizerPlugin(),
            ],
            chunkIds: "named",
            concatenateModules: true,
            // splitChunks: {
            //     chunks: 'all',
            //     filename: "js/[id].[contenthash].js"
            // },
            moduleIds: "deterministic",
            realContentHash: true,
            usedExports: true,
        },
    }
}
;
